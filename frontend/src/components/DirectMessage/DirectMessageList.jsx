import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { DirectMessage } from "./DirectMessage";
import { addDm } from "../../store/directMessages";
import "../../styles/components/ChannelMessageList.css";
import { MainLoader } from "../Loading/MainLoader";

export function DirectMessageList({ socket }) {
  const user = useSelector((state) => state.session.user);
  const { directMessageId } = useParams();
  const dispatch = useDispatch();
  const messageContainerRef = useRef(null);
  const newMessagesIds = useSelector(
    (state) => state.directMessages.users[directMessageId]?.orderedMessages
  );
  useEffect(() => {
    if (!socket) return;
    socket.on(`user-dm-${user.id}`, (dm) => {
      dispatch(addDm(dm));
    });
    return () => {
      socket.off(`user-id-${user.id}`);
    };
  }, [directMessageId]);

  if (!socket) return false;

  // useEffect(() => {

  // }, [directMessageId])

  if (!newMessagesIds) return <MainLoader />;

  return (
    <>
      {newMessagesIds.map((mId) => (
        <DirectMessage key={mId} messageId={mId} usrId={directMessageId} />
      ))}
    </>
  );
}
