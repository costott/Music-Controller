import React, { useState, Component } from "react";
import {
	Button,
	Grid,
	Typography,
	TextField,
	FormHelperText,
	FormControl,
	Radio,
	RadioGroup,
	FormControlLabel,
	Collapse,
	Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function RoomCreatePage({
	votesToSkip = 2,
	guestCanPause = false,
	update = false,
	roomCode = null,
	updateCallBack = () => {},
}) {
	const navigate = useNavigate();

	const [thisguestCanPause, setguestCanPause] = useState(guestCanPause);
	const [thisvotesToSkip, setvotesToSkip] = useState(votesToSkip);
	const [successMsg, setsuccessMsg] = useState("");
	const [errorMsg, seterrorMsg] = useState("");

	const handleVotesChange = (e) => {
		setvotesToSkip(e.target.value);
	};

	const handleGuestCanPauseChange = (e) => {
		setguestCanPause(e.target.value === "true" ? true : false);
	};

	const handleRoomButtonPressed = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				votes_to_skip: thisvotesToSkip,
				guest_can_pause: thisguestCanPause,
			}),
		};
		fetch("/api/create-room", requestOptions)
			.then((response) => response.json())
			.then((data) => navigate("/room/" + data.code));
	};

	const handleUpdateButtonPressed = () => {
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				votes_to_skip: thisvotesToSkip,
				guest_can_pause: thisguestCanPause,
				code: roomCode,
			}),
		};
		fetch("/api/update-room", requestOptions).then((response) => {
			if (response.ok) {
				setsuccessMsg("Room updated successfully!");
			} else {
				seterrorMsg("Error updating room...");
			}
			updateCallBack();
		});
	};

	const renderCreateButtons = () => {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Button
						color="primary"
						variant="contained"
						onClick={handleRoomButtonPressed}
					>
						create a room
					</Button>
				</Grid>
				<Grid item xs={12} align="center">
					<Button color="secondary" variant="contained" to="/" component={Link}>
						back
					</Button>
				</Grid>
			</Grid>
		);
	};

	const renderUpdateButtons = () => {
		return (
			<Grid item xs={12} align="center">
				<Button
					color="primary"
					variant="contained"
					onClick={handleUpdateButtonPressed}
				>
					update room
				</Button>
			</Grid>
		);
	};

	const title = update ? `Update Room ${roomCode}` : "Create a Room";

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Collapse in={errorMsg != "" || successMsg != ""}>
					{successMsg != "" ? (
						<Alert severity="success" onClose={() => setsuccessMsg("")}>
							{successMsg}
						</Alert>
					) : (
						<Alert severity="error" onClose={() => seterrorMsg("")}>
							{errorMsg}
						</Alert>
					)}
				</Collapse>
			</Grid>
			<Grid item xs={12} align="center">
				<Typography component="h4" variant="h4">
					{title}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl component="fieldset">
					<FormHelperText component="div">
						<div align="center">Guest Control of Playback State</div>
					</FormHelperText>
					<RadioGroup
						row
						defaultValue={thisguestCanPause.toString()}
						onChange={handleGuestCanPauseChange}
					>
						<FormControlLabel
							value="true"
							control={<Radio color="primary" />}
							label="Play/Pause"
							labelPlacement="bottom"
						/>
						<FormControlLabel
							value="false"
							control={<Radio color="secondary" />}
							label="No Control"
							labelPlacement="bottom"
						/>
					</RadioGroup>
				</FormControl>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl>
					<TextField
						required={true}
						type="number"
						onChange={handleVotesChange}
						defaultValue={thisvotesToSkip}
						inputProps={{ min: 1, style: { textAlign: "center" } }}
					/>
					<FormHelperText component="div">
						<div align="center">votes required to skip song</div>
					</FormHelperText>
				</FormControl>
			</Grid>
			{update ? renderUpdateButtons() : renderCreateButtons()}
		</Grid>
	);
}
