import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Button } from "react-bootstrap";

import style from "./style";
import { updateLikedTracks } from "../../utils/requests";

const MINUTE_MS = 1000 * 60;

const FetchTracksSetting = ({ user }) => {
  const msSinceUpdate = Date.now() - Date.parse(user.lastUpdate);
  const [minutesRemaining, setMinutesRemaining] = useState(
    Math.ceil(60 - msSinceUpdate / 60 / 1000)
  );
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setMessage("Loading tracks... This can take a little while");
    const res = await updateLikedTracks();
    if (res.status === 200) {
      setMinutesRemaining(60);
      return setMessage(
        "Success! Head over to the home page to view your library"
      );
    }
    return setMessage("Something went wrong...");
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMinutesRemaining(minutesRemaining - 1);
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      {minutesRemaining <= 0 && !message && (
        <Button className={style.fadeIn} onClick={handleClick}>
          Fetch tracks from spotify
        </Button>
      )}
      {message && <p className={style.fadeIn}>{message}</p>}
      {minutesRemaining > 0 && (
        <p>Check back in {minutesRemaining} minutes to update tracks</p>
      )}
    </>
  );
};

export default FetchTracksSetting;
