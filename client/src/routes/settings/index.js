import { h } from "preact";
import { useContext } from "preact/hooks";

import UserContext from "../../utils/UserContext";
import FetchTracksSetting from "../../components/fetchTracksSetting";

const Settings = () => {
  const user = useContext(UserContext);
  if (!user) return null;
  return (
    <div className="text-center mt-4">
      <p>User: {user.displayName}</p>
      <FetchTracksSetting user={user} />
    </div>
  );
};

export default Settings;
