import { h } from "preact";

import FetchTracksSetting from "../../components/fetchTracksSetting";

const Settings = ({ user }) => {
  if (!user) return null;
  return (
    <main className="text-center mt-4">
      <h3>User: {user.displayName}</h3>
      <br />
      <FetchTracksSetting user={user} />
    </main>
  );
};

export default Settings;
