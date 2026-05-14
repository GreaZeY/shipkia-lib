import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { type FormConfig } from "@/components/ui/forms/FormBuilder/types";
import { ReactiveEngine } from "@/framework/reactive/engine";
import type { ReactiveRule } from "@/framework/reactive/compat";
import type { FieldLogic, ReactiveEngineOptions } from "@/framework/reactive/types";
import { Transaction } from "@/framework/runtime/transaction";
import { z } from "zod";

type FormValues = Record<string, unknown>;

export interface UseFormOptions {
  config?: FormConfig;
  onSubmit?: (data: FormValues) => void;
  defaultValues?: FormValues;
  /** New: server-driven logic rules */
  logics?: FieldLogic[];
  /** Legacy: old-format reactive rules (backward compat) */
  rules?: ReactiveRule[];
  schema?: z.ZodType<FormValues>;
  /** Custom action handlers for async operations like fetch/option */
  actionHandlers?: Record<
    string,
    (ctx: { action: FieldLogic["actions"][0]; allValues: FormValues }) => Record<string, Partial<{ value: unknown; visible: boolean; disabled: boolean }>>
  >;
}

export function useForm({
  onSubmit,
  defaultValues = {},
  logics = [],
  rules = [],
  schema,
  actionHandlers,
}: UseFormOptions = {}) {
  const formRef = useRef<HTMLFormElement>(null);

  // Build engine options
  const engineOpts: ReactiveEngineOptions = {
    schema,
    initialValues: defaultValues,
  };

  // If new logics are provided, use them directly
  if (logics.length > 0) {
    engineOpts.logics = logics;
  }

  // The Orchestration Engine
  const engineRef = useRef(new ReactiveEngine(engineOpts));

  // If legacy rules are provided, load them as a compatibility layer
  // (the old ReactiveRule format is NOT loaded into the new engine;
  //  we keep backward compat at the hook level)
  const legacyRulesRef = useRef(rules);

  // Register custom action handlers
  if (actionHandlers) {
    Object.entries(actionHandlers).forEach(([opr, handler]) => {
      engineRef.current.addAction(opr, ({ action, allValues }) => {
        return handler({ action, allValues });
      });
    });
  }

  // Subscription system for UI updates
  const subscribersRef = useRef<Set<(name?: string) => void>>(new Set());

  const notify = useCallback((name?: string) => {
    subscribersRef.current.forEach((cb) => cb(name));
  }, []);

  /**
   * Section 23: "All runtime updates are transactional."
   */
  const setValue = useCallback(
    (name: string, value: unknown) => {
      // 1. Start a transaction
      const transaction = new Transaction(
        engineRef.current.getAllValues(),
        (_finalData, patches) => {
          // 4. Commit results to the engine and notify UI
          Object.keys(patches).forEach((target) => notify(target));
        },
      );

      // 2. Evaluate logic via the Engine
      const patches = engineRef.current.update(name, value);

      // 3. Add to transaction
      transaction.addPatch({ [name]: value, ...patches });
      transaction.commit();
    },
    [notify],
  );

  const getValue = useCallback((name: string) => {
    return engineRef.current.getFieldState(name).value;
  }, []);

  const getFieldState = useCallback((name: string) => {
    return engineRef.current.getFieldState(name);
  }, []);

  const register = useCallback(
    (name: string) => {
      return {
        name,
        value: getValue(name),
        onChange: (e: unknown) => {
          const val =
            e && typeof e === "object" && "target" in e
              ? (e as ChangeEvent<HTMLInputElement>).target.value
              : e;
          setValue(name, val);
        },
      };
    },
    [getValue, setValue],
  );

  const handleSubmit = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      if (e && e.preventDefault) e.preventDefault();

      const errors = engineRef.current.validate();
      if (Object.keys(errors).length > 0) {
        return;
      }

      if (onSubmit) {
        onSubmit(engineRef.current.getAllValues());
      }
    },
    [onSubmit],
  );

  const reset = useCallback(() => {
    const opts: ReactiveEngineOptions = {
      schema,
      initialValues: defaultValues,
    };
    if (logics.length > 0) opts.logics = logics;
    engineRef.current = new ReactiveEngine(opts);
    notify();
  }, [defaultValues, logics, schema, notify]);

  /**
   * Access the engine instance directly for advanced use cases
   * (e.g., registering custom conditions/actions from a component).
   */
  const getEngine = useCallback(() => {
    return engineRef.current;
  }, []);

  return {
    formRef,
    handleSubmit,
    reset,
    setValue,
    getValue,
    getFieldState,
    register,
    subscribersRef,
    getEngine,
    /** @deprecated Use logics instead */
    _legacyRules: legacyRulesRef.current,
  };
}

export type FormContextType = ReturnType<typeof useForm>;
export const FormContext = createContext<FormContextType | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context)
    throw new Error("useFormContext must be used within FormBuilder");
  return context;
};

export function useWatch(name?: string) {
  const { getFieldState, subscribersRef } = useFormContext();
  const [state, setState] = useState(() => getFieldState(name || ""));

  useEffect(() => {
    const cb = (changedName?: string) => {
      if (!name || name === changedName) {
        setState({ ...getFieldState(name || "") });
      }
    };
    subscribersRef.current?.add(cb);
    return () => {
      subscribersRef.current?.delete(cb);
    };
  }, [name, subscribersRef, getFieldState]);

  return name ? state.value : state;
}

export function useFieldState(name: string) {
  const { getFieldState, subscribersRef } = useFormContext();
  const [state, setState] = useState(() => getFieldState(name));

  useEffect(() => {
    const cb = (changedName?: string) => {
      if (name === changedName) {
        setState({ ...getFieldState(name) });
      }
    };
    subscribersRef.current?.add(cb);
    return () => {
      subscribersRef.current?.delete(cb);
    };
  }, [name, subscribersRef, getFieldState]);

  return state;
}
