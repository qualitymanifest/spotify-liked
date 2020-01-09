import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Button } from "react-bootstrap";

import style from "./style";
import { updateLikedTracks } from "../../utils/requests";

const FetchTracksSetting = ({ user }) => {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setMessage("Loading tracks... This can take a little while");
    const res = await updateLikedTracks();
    if (res.status === 200) {
      return setMessage(
        "Success! Head over to the home page to view your library"
      );
    }
    if (res.status === 429) {
      const json = await res.json();
      return setMessage(json.message);
    }
    return setMessage("Something went wrong...");
  };

  return (
    <>
      {!message && (
        <Button className={style.fadeIn} onClick={handleClick}>
          Upload tracks from spotify
        </Button>
      )}
      {message && <p className={style.fadeIn}>{message}</p>}
    </>
  );
};

export default FetchTracksSetting;
