import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

type TASK_FUNCTION_TYPE = () => Promise<void>;
type TASK_ID_TYPE = string;

async function registerBackgroundFetchAsync(
  TASK_ID: TASK_ID_TYPE,
  TASK_FUNCTION: TASK_FUNCTION_TYPE
) {
  TaskManager.defineTask(TASK_ID, async () => {
    const now = Date.now();

    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

    await TASK_FUNCTION();

    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

  return BackgroundFetch.registerTaskAsync(TASK_ID, {
    minimumInterval: 60,
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync(TASK_ID: TASK_ID_TYPE) {
  return BackgroundFetch.unregisterTaskAsync(TASK_ID);
}

export const startBackgroundFetch = (TASK_ID: TASK_ID_TYPE, TASK_FUNCTION: TASK_FUNCTION_TYPE) =>
  registerBackgroundFetchAsync(TASK_ID, TASK_FUNCTION);
export const removeBackgroundFetch = (TASK_ID: string) => unregisterBackgroundFetchAsync(TASK_ID);
