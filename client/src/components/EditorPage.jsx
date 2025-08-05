import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import CodeEditor from "./CodeEditor";
import Output from "./Output";
import Topbar from "./Topbar";
import { initSocket } from "../socket";
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Start coding here");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.emit("connection_error", (err) => {
        handleError(err);
      });
      socketRef.current.emit("connection_failed", (err) => {
        handleError(err);
      });

      const handleError = (e) => {
        console.log("socket error", e);
        toast.error("Socket connection failed");
        navigate("/");
      };

      socketRef.current.emit("join", {
        roomId,
        username: location.state?.username,
      });

      // Listen for code-change event to get the latest code
      socketRef.current.on("code-change", ({ newCode }) => {
        setCode(newCode); // Update code with the latest code in the room
      });

      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined`);
        }
        setCollaborators(clients);
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast(`${username} left`);
        setCollaborators((prev) => {
          return prev.filter(
            (collaborator) => collaborator.socketId !== socketId
          );
        });
      });
    };

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off("joined");
      socketRef.current.off("disconnected");
      socketRef.current.off("code-change");
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const clearOutput = () => {
    setOutput("");
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      const languageMap = {
        javascript: 93,
        python: 92,
        cpp: 54,
        java: 91,
      };

      const languageId = languageMap[language];
      if (!languageId) {
        setOutput(`Execution for ${language} is not supported.`);
        setLoading(false);
        return;
      }

      const { data: submission } = await axios.post(
        "https://devcollab-1-p1pe.onrender.com/run",
        {
          source_code: code,
          language_id: languageId,
          stdin: "",
        }
      );

      if (submission.stderr) {
        setOutput(`Error: ${submission.stderr}`);
      } else if (submission.compile_output) {
        setOutput(`Compilation Error: ${submission.compile_output}`);
      } else {
        setOutput(submission.stdout || "Code executed successfully.");
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col overflow-hidden">
      <Topbar collaborators={collaborators} />
      <div className="flex flex-1">
        {/* Code Editor on Left Half */}
        <div className="flex-1 p-4">
          <CodeEditor
            socketRef={socketRef}
            roomId={roomId}
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            runCode={runCode}
          />
        </div>

        {/* Output on Right Half */}
        <div className="w-1/2 p-4">
          <Output output={output} loading={loading} clearOutput={clearOutput} />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
