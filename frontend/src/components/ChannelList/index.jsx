import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetAllServers } from "../../store/server";
import ServerList from "../ServerList";
import ChannelMenuDrop from "./ChannelMenuDrop";
import '../../styles/components/ServerList.css';
import '../../styles/components/ChannelList.css';

function ChannelList() {
    const serversStore = useSelector((state) => state.servers)
    const { serverId, channelId } = useParams()
    const dispatch = useDispatch()
    const servers = Object.values(serversStore)
    const server = servers[serverId - 1]
    useEffect(() => {
        dispatch(thunkGetAllServers())
    }, [dispatch]);


    const createChannel = () => {
        alert("Need to add create channel")
    }

    return (
        <>
        	<div className="main-page-container">
				<div className="server-list-container">
					<ServerList />
				</div>
				<div className="dm-list-container">
                    <div className="dm-list-header">
                        <ChannelMenuDrop />
                        <p>{server.name}</p>
                    </div>
                    <div className="channel-list-container">
                        <div className="channel-list-textchannels">
                            <p>TEXT CHANNELS</p> <i onClick={createChannel} className="fa-solid fa-plus channel-list-add"></i>
                        </div>
                        {server.channels.map(channel => (
                            <>
                                <span>{channel.type == "text" ? <i class="fa-solid fa-hashtag fa-md"></i> : ""}{channel.name}</span>
                            </>
                        ))}
                    </div>
				</div>
				<div className="general-view-container">
					<div>asdasd</div>
				</div>
			</div>
        </>
    )
}

export default ChannelList