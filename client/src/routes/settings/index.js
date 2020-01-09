import { h } from "preact";
import { useContext } from "preact/hooks";

import UserContext from "../../utils/UserContext";
import FetchTracksSetting from "../../components/fetchTracksSetting";

const Settings = () => {
  const user = useContext(UserContext);
  if (!user) return null;
  return (
    <main className="text-center mt-4">
      <h3>User: {user.displayName}</h3>
      <FetchTracksSetting user={user} />
    </main>
  );
};

export default Settings;
