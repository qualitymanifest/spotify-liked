import { h } from "preact";
import { useState } from "preact/hooks";
import { Button } from "react-bootstrap";

import style from "./style";
import { updateLikedTracks } from "../../utils/requests";

const MINUTE_MS = 1000 * 60;

const FetchTracksSetting = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [doneMessage, setDoneMessage] = useState("");
  const handleClick = async () => {
    setLoading(true);
    const res = await updateLikedTracks();
    setLoading(false);
    console.log(res.status);
    if (res.status === 200) {
      return setDoneMessage(
        "Success! Head over to the home page to view your library"
      );
    }
    return setDoneMessage("Something went wrong.");
  };
  // TODO: use UTC on both client and server
  // Set user lastUpdate field set to old date on account creation
  const msSinceUpdate = Date.now() - Date.parse(user.lastUpdate);
  const hourSinceUpdate = msSinceUpdate > 1000 * 60 * 60;
  const minutesRemaining = 60 - Math.ceil(msSinceUpdate / 60 / 1000);
  return (
    <>
      {hourSinceUpdate && !loading && (
        <Button className={style.fadeIn} onClick={handleClick}>
          Fetch tracks from spotify
        </Button>
      )}
      {loading && (
        <p className={style.fadeIn}>
          Loading tracks... This can take a little while
        </p>
      )}
      {doneMessage && <p className={style.fadeIn}>{doneMessage}</p>}
      {!hourSinceUpdate && !doneMessage && (
        <p>Check back in {minutesRemaining} minutes to update tracks</p>
      )}
    </>
  );
};

export default FetchTracksSetting;
