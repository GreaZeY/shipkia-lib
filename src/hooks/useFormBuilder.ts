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
import { ReactiveEngine, type ReactiveRule } from "@/framework/reactive/engine";
import { Transaction } from "@/framework/runtime/transaction";
import { z } from "zod";

type FormValues = Record<string, unknown>;

export interface UseFormOptions {
  config?: FormConfig;
  onSubmit?: (data: FormValues) => void;
  defaultValues?: FormValues;
  rules?: ReactiveRule[];
  schema?: z.ZodType<FormValues>;
}

export function useForm({ onSubmit, defaultValues = {}, rules = [], schema }: UseFormOptions = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // The Orchestration Engine
  const engineRef = useRef(new ReactiveEngine({ 
    rules, 
    schema, 
    initialValues: defaultValues 
  }));

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
      const transaction = new Transaction(engineRef.current.getAllValues(), (_finalData, patches) => {
        // 4. Commit results to the engine and notify UI
        Object.keys(patches).forEach(target => notify(target));
      });

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

  const register = useCallback((name: string) => {
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
  }, [getValue, setValue]);

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
    engineRef.current = new ReactiveEngine({ rules, schema, initialValues: defaultValues });
    notify();
  }, [defaultValues, rules, schema, notify]);

  return {
    formRef,
    handleSubmit,
    reset,
    setValue,
    getValue,
    getFieldState,
    register,
    subscribersRef,
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
