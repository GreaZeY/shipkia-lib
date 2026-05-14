/**
 * Scheduler Runtime
 * 
 * Section 22 of LLD: "Never mutate synchronously. Always queue work."
 * Batching, prioritization, and render scheduling.
 */

export type Task = () => void;

class Scheduler {
  private queue: Task[] = [];
  private isProcessing = false;

  /**
   * Queue a task to be executed in the next frame.
   * Section 22: "Event queued -> Scheduler batch -> Runtime execution"
   */
  public enqueue(task: Task): void {
    this.queue.push(task);
    this.schedule();
  }

  private schedule(): void {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    
    // Use requestAnimationFrame for batching (Section 22: "Render scheduling")
    requestAnimationFrame(() => {
      this.flush();
    });
  }

  private flush(): void {
    const tasks = [...this.queue];
    this.queue = [];
    
    console.log(`[buopso] Scheduler flushing ${tasks.length} tasks.`);

    tasks.forEach((task) => {
      try {
        task();
      } catch (err) {
        console.error("[buopso] Scheduler task failed:", err);
      }
    });

    this.isProcessing = false;
    
    // If more tasks were added during flush, schedule again
    if (this.queue.length > 0) {
      this.schedule();
    }
  }
}

export const scheduler = new Scheduler();
