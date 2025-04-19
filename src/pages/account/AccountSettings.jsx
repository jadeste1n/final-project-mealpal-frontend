import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import {
  me,
  updateSettings,
  signOut,
  deleteAccount,
  updatePassword,
} from "@/data";
import { toast } from "react-toastify";
import Modal from "@/components/general/Modal";
import InfoRow from "@/components/account/InfoRow";

const AccountSettings = () => {
  const { setIsAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [isHeightModalOpen, setIsHeightModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

  const handleChangeModal = (field) => {
    switch (field) {
      case "gender":
        setIsGenderModalOpen(true);
        break;
      case "weight":
        setIsWeightModalOpen(true);
        break;
      case "age":
        setIsAgeModalOpen(true);
        break;
      case "height":
        setIsHeightModalOpen(true);
        break;
      case "goal":
        setIsGoalModalOpen(true);
        break;
      case "password":
        setIsPasswordModalOpen(true);
        break;
      case "userName":
        setIsUsernameModalOpen(true);
        break;
      default:
        handleEdit(field);
    }
  };

  const handleFieldChange = async (field, value) => {
    try {
      const res = await updateSettings({ [field]: value });
      setUser(res);
      toast.success(
        `${field.charAt(0).toUpperCase() + field.slice(1)} updated`
      );
    } catch (err) {
      toast.error("Update failed");
    } finally {
      modalConfig[field]?.setOpen(false);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const { currentPassword, newPassword } = passwordData;

      if (!currentPassword || !newPassword) {
        toast.error("Please enter both your current and new password.");
        return;
      }

      await updatePassword({ currentPassword, newPassword });

      setPasswordData({ currentPassword: "", newPassword: "" });
      setEditField(null);
      toast.success("Password updated successfully.");
    } catch (err) {
      // Try to get a more specific error message from the server response
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";

      if (message.toLowerCase().includes("unauthorized")) {
        toast.error("Current password is incorrect.");
      } else {
        toast.error(`${message}`);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await me();
      setUser(userData);
      setFormData(userData);
    };
    fetchData();
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
  };

  const handleDelete = async () => {
    await deleteAccount();
    setIsAuthenticated(false);
  };

  const modalConfig = {
    userName: {
      isOpen: isUsernameModalOpen,
      setOpen: setIsUsernameModalOpen,
      label: "Update Username",
      content: (
        <>
          <input
            type="text"
            name="userName"
            placeholder="Enter new username"
            value={formData.userName || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <div className="flex justify-end gap-2">
            <button
              className="btn"
              onClick={() => setIsUsernameModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleFieldChange("userName", formData.userName)}
            >
              Save
            </button>
          </div>
        </>
      ),
    },
    password: {
      isOpen: isPasswordModalOpen,
      setOpen: setIsPasswordModalOpen,
      label: "Change Password",
      content: (
        <>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="input input-bordered w-full"
          />
          <div className="flex justify-end gap-2">
            <button
              className="btn"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handlePasswordUpdate}>
              Save
            </button>
          </div>
        </>
      ),
    },
    gender: {
      isOpen: isGenderModalOpen,
      setOpen: setIsGenderModalOpen,
      label: "Choose Gender",
      content: (
        <div className="flex justify-between gap-4">
          <button
            className="btn"
            onClick={() => handleFieldChange("gender", "male")}
          >
            Male
          </button>
          <button
            className="btn"
            onClick={() => handleFieldChange("gender", "female")}
          >
            Female
          </button>
        </div>
      ),
    },
    weight: {
      isOpen: isWeightModalOpen,
      setOpen: setIsWeightModalOpen,
      label: "Enter Your Weight (kg)",
      content: (
        <>
          <input
            type="number"
            min="30"
            max="150"
            step="1"
            className="input input-bordered w-full"
            value={formData.weight || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                weight: parseInt(e.target.value, 10),
              }))
            }
          />
          <div className="flex justify-end gap-2">
            <button className="btn" onClick={() => setIsWeightModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleFieldChange("weight", formData.weight)}
            >
              Save
            </button>
          </div>
        </>
      ),
    },
    age: {
      isOpen: isAgeModalOpen,
      setOpen: setIsAgeModalOpen,
      label: "Enter Your Age",
      content: (
        <>
          <input
            type="number"
            min="10"
            max="120"
            step="1"
            className="input input-bordered w-full"
            value={formData.age || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                age: parseInt(e.target.value, 10),
              }))
            }
          />
          <div className="flex justify-end gap-2">
            <button className="btn" onClick={() => setIsAgeModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleFieldChange("age", formData.age)}
            >
              Save
            </button>
          </div>
        </>
      ),
    },
    height: {
      isOpen: isHeightModalOpen,
      setOpen: setIsHeightModalOpen,
      label: "Enter Your Height (cm)",
      content: (
        <>
          <input
            type="number"
            min="100"
            max="250"
            step="1"
            className="input input-bordered w-full"
            value={formData.height || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                height: parseInt(e.target.value, 10),
              }))
            }
          />
          <div className="flex justify-end gap-2">
            <button className="btn" onClick={() => setIsHeightModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleFieldChange("height", formData.height)}
            >
              Save
            </button>
          </div>
        </>
      ),
    },
    goal: {
      isOpen: isGoalModalOpen,
      setOpen: setIsGoalModalOpen,
      label: "Select Your Goal",
      content: (
        <>
          <select
            className="select select-bordered w-full"
            value={formData.goal || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                goal: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select goal
            </option>
            <option value="lose weight">Lose Weight</option>
            <option value="gain muscle">Gain Muscle</option>
            <option value="maintain">Maintain</option>
          </select>
          <div className="flex justify-end gap-2">
            <button className="btn" onClick={() => setIsGoalModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleFieldChange("goal", formData.goal)}
            >
              Save
            </button>
          </div>
        </>
      ),
    },
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <div className="relative mb-6">
        <h2 className="text-xl font-semibold text-center">Profile</h2>
      </div>

      {/* Account section */}
      <h3 className="font-medium text-lg mt-8 mb-2 text-left">
        Account Settings
      </h3>
      <div>
        <InfoRow
          label="Username"
          field="userName"
          value={user.userName}
          onClick={handleChangeModal}
        />
        <InfoRow
          label="Email"
          field="email"
          value={user.email}
          onClick={handleChangeModal}
        />
        <InfoRow
          label="Password"
          field="password"
          value="••••••••"
          onClick={handleChangeModal}
        />
      </div>

      {/* Profile section */}
      <h3 className="font-medium text-lg mt-8 mb-2 text-left">
        Profile Details
      </h3>
      <div>
        <InfoRow
          label="Age"
          field="age"
          value={user.age}
          onClick={handleChangeModal}
        />
        <InfoRow
          label="Gender"
          field="gender"
          value={user.gender}
          onClick={handleChangeModal}
        />
        <InfoRow
          label="Weight"
          field="weight"
          value={user.weight}
          onClick={handleChangeModal}
        />
        <InfoRow
          label="Height"
          field="height"
          value={user.height}
          onClick={handleChangeModal}
        />
        <InfoRow
          label="Goal"
          field="goal"
          value={user.goal}
          onClick={handleChangeModal}
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          className="text-red-500 underline text-sm"
          onClick={handleDelete}
        >
          Delete Account
        </button>

        <button
          onClick={handleLogout}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>

      {Object.entries(modalConfig).map(([key, config]) => (
        <Modal
          key={key}
          isOpen={config.isOpen}
          onClose={() => config.setOpen(false)}
        >
          <h3 className="text-lg font-bold mb-4">{config.label}</h3>
          <div className="flex flex-col gap-4">{config.content}</div>
        </Modal>
      ))}
    </div>
  );
};

export default AccountSettings;
