import React, { useState, useContext, Component, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";

import RoomCreatePage from "./RoomCreatePage";
import MusicPlayer from "./MusicPlayer";

export default function Room(props) {
	const navigate = useNavigate();

	const [votesToSkip, setvotesToSkip] = useState(2);
	const [guestCanPause, setguestCanPause] = useState(false);
	const [isHost, setisHost] = useState(false);
	const [showSettings, setshowSettings] = useState(false);
	const [spotifyAuthenticated, setspotifyAuthenticated] = useState(false);
	const [song, setsong] = useState({});

	useEffect(() => {
		// component mounted
		var interval = setInterval(getCurrentSong, 1000);
		// component will unmount
		return () => {
			clearInterval(interval);
		};
	}, []);

	const getRoomDetails = () => {
		const { roomCode } = useParams();
		fetch("/api/get-room" + "?code=" + roomCode)
			.then((response) => {
				if (!response.ok) {
					props.leaveRoomCallback();
					navigate("/");
				}
				return response.json();
			})
			.then((data) => {
				setvotesToSkip(data.votes_to_skip);
				setguestCanPause(data.guest_can_pause);
				setisHost(data.is_host);
				if (isHost) {
					authenticateSpotify();
				}
			});
	};

	const authenticateSpotify = () => {
		fetch("/spotify/is-authenticated")
			.then((response) => response.json())
			.then((data) => {
				setspotifyAuthenticated(data.status);
				if (!data.status) {
					fetch("/spotify/get-auth-url")
						.then((response) => response.json())
						.then((data) => {
							window.location.replace(data.url);
						});
				}
			});
	};

	const getCurrentSong = () => {
		fetch("/spotify/current-song")
			.then((response) => {
				if (!response.ok) {
					return {};
				} else {
					return response.json();
				}
			})
			.then((data) => {
				setsong(data);
			});
	};

	getRoomDetails();

	const leaveButtonPressed = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		};
		fetch("/api/leave-room", requestOptions).then((_response) => {
			props.leaveRoomCallback();
			navigate("/");
		});
	};

	const renderSettings = () => {
		return (
			<Grid container spacing={1} align="center">
				<Grid item xs={12}>
					<RoomCreatePage
						update={true}
						votesToSkip={votesToSkip}
						guestCanPause={guestCanPause}
						roomCode={roomCode}
						updateCallBack={getRoomDetails}
					/>
				</Grid>
				<Grid item xs={12}>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => setshowSettings(false)}
					>
						Close
					</Button>
				</Grid>
			</Grid>
		);
	};

	const renderSettingsButton = () => {
		return (
			<Grid item xs={12}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => setshowSettings(true)}
				>
					Settings
				</Button>
			</Grid>
		);
	};

	const { roomCode } = useParams();
	if (showSettings) {
		return renderSettings();
	}
	return (
		<Grid container spacing={1} align="center">
			<Grid item xs={12}>
				<Typography variant="h4" component="h4">
					Code: {roomCode}
				</Typography>
			</Grid>
			<MusicPlayer {...song} />
			{isHost ? renderSettingsButton() : null}
			<Grid item xs={12}>
				<Button
					variant="contained"
					color="secondary"
					onClick={leaveButtonPressed}
				>
					Leave Room
				</Button>
			</Grid>
		</Grid>
	);
}
