import { useEffect, useState } from "react";
import { useEthers, useContractFunction, useCall } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "ethers";
import { Sepolia } from "@usedapp/core";
import contractAbi from "./abi/ToDo.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;

interface Task {
  content: string;
  completed: boolean;
}

function App() {
  const { account: address, activateBrowserWallet: connectToYourWallet, chainId, library } = useEthers();

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-red-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold mb-2">🚫 Contract Not Found</h2>
          <p className="text-red-300">
            Smart contract address is missing or invalid. Please set <code>VITE_CONTRACT_ADDRESS</code> in your environment variables.
          </p>
        </div>
      </div>
    );
  }

  // console.log("==========================", address);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Contract instances
  const signerContract = library
    ? new Contract(CONTRACT_ADDRESS, contractAbi, library)
    : null;
  // console.log("ccccccccccccccccccccc", contractAbi);

  const readOnlyProvider = getDefaultProvider(
    "https://sepolia.infura.io/v3/fe4cbb35f77a406fbbbc0bfdc3b82a82"
  );
  const readOnlyContract = new Contract(
    CONTRACT_ADDRESS,
    contractAbi,
    readOnlyProvider
  );
  // console.log("==========================readOnlyContract", readOnlyContract);

  // Chain switching notice
  useEffect(() => {
    if (address && chainId !== Sepolia.chainId) {
      // console.log("==========================", address);
      console.log("Please switch to Sepolia testnet.");
    }
  }, [address, chainId]);

  // useCall to read task count
  const { value: taskCount} =
    useCall({
      contract: readOnlyContract,
      method: "getTasksCount",
      args: [],
    }) ?? {};

  const effectiveTaskCount = taskCount ? taskCount[0].toNumber() : 0;

  // Fetch all tasks when task count changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!address || !signerContract || !taskCount || isLoading) return;

      setIsLoading(true);
      try {
        const tasks: Task[] = [];
        for (let i = 0; i < effectiveTaskCount; i++) {
          const task = await signerContract.getTask(i);
          tasks.push({ content: task[0], completed: task[1] });
        }
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [address, signerContract, effectiveTaskCount, isLoading, taskCount]);

  // Write functions
  const { send: createTask, state: createTaskState } = useContractFunction(
    signerContract as any,
    "createTask",
    { transactionName: "Create Task" }
  );
  const { send: toggleTask, state: toggleTaskState } = useContractFunction(
    signerContract as any,
    "toggleCompleted",
    { transactionName: "Toggle Task" }
  );

  // Add task
  const addTask = async () => {
    if (!newTask || !signerContract) return;
    try {
      await createTask(newTask);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle task
  const toggleTaskCompleted = async (index: number) => {
    if (!signerContract) return;
    try {
      await toggleTask(index);
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Refetch after successful transaction
  useEffect(() => {
    const fetchTasks = async () => {
      if (!signerContract || !address || !taskCount) return;
      const tasks: Task[] = [];
      for (let i = 0; i < effectiveTaskCount; i++) {
        const task = await signerContract.getTask(i);
        tasks.push({ content: task[0], completed: task[1] });
      }
      setTasks(tasks);
    };

    if (
      (createTaskState.status === "Success" ||
        toggleTaskState.status === "Success") &&
      signerContract
    ) {
      fetchTasks();
    }
  }, [
    createTaskState.status,
    toggleTaskState.status,
    signerContract,
    address,
    effectiveTaskCount,
    taskCount,
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          📝 Blockchain ToDo App
        </h1>

        {!address ? (
          <button
            onClick={() => connectToYourWallet()}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-bold mx-auto block"
          >
            Connect Wallet
          </button>
        ) : chainId !== Sepolia.chainId ? (
          <p className="text-center">
            Please switch to Sepolia testnet in MetaMask.
          </p>
        ) : !taskCount ? (
          <p className="text-center text-yellow-400">
            Loading tasks from blockchain...
          </p>
        ) : (
          <>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task"
                className="flex-grow px-4 py-2 rounded-lg text-black"
              />
              <button
                onClick={addTask}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-bold"
                disabled={createTaskState.status === "Mining"}
              >
                {createTaskState.status === "Mining" ? "Adding..." : "Add"}
              </button>
            </div>
            <ul className="space-y-3">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    task.completed ? "bg-green-700" : "bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompleted(index)}
                      className="w-5 h-5"
                      disabled={toggleTaskState.status === "Mining"}
                    />
                    <span
                      className={`text-lg ${
                        task.completed ? "line-through opacity-70" : ""
                      }`}
                    >
                      {task.content}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {(createTaskState.status === "Mining" ||
              toggleTaskState.status === "Mining") && (
              <p className="text-center mt-4 text-yellow-400">
                Transaction in progress...
              </p>
            )}
            {(createTaskState.status === "Exception" ||
              toggleTaskState.status === "Exception") && (
              <p className="text-center mt-4 text-red-400">
                Error:{" "}
                {createTaskState.errorMessage || toggleTaskState.errorMessage}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
