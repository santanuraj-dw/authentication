import React, { useState } from "react";
import api from "../../services/api";

const ProjectManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchEmployees = async () => {
    const res = await api.get("/employees", {
      params: { page, limit: 5, search },
    });

    setEmployees(res.data.data.employees);
    setTotalPages(res.data.data.totalPages);
  };

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search]);

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Projects</th>
              <th className="p-3">Assign</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="p-3">{emp.username}</td>

                <td className="p-3">
                  {emp.assignedProjects?.map((p) => (
                    <span
                      key={p._id}
                      className="px-2 py-1 bg-gray-200 text-xs mr-1"
                    >
                      {p.name}
                    </span>
                  ))}
                </td>

                <td className="p-3">
                  <select
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        [emp._id]: e.target.value,
                      })
                    }
                    className="border p-1"
                  >
                    <option value="">Select Project</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={async () => {
                      await Api.patch(`/assign-project/${emp._id}`, {
                        projectId: selectedProject[emp._id],
                      });

                      fetchEmployees();
                    }}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
