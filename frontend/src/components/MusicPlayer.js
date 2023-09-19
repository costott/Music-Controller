import React from "react";
import {
	Grid,
	Typography,
	Card,
	LinearProgress,
	IconButton,
} from "@mui/material";
import { PlayArrow, SkipNext, Pause } from "@mui/icons-material";

export default function MusicPlayer(props) {
	const pauseSong = () => {
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "applications/json" },
		};
		fetch("/spotify/pause", requestOptions);
	};

	const playSong = () => {
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "applications/json" },
		};
		fetch("/spotify/play", requestOptions);
	};

	const skipSong = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "applications/json" },
		};
		fetch("/spotify/skip", requestOptions);
	};

	const songProgress = (100 * props.time) / props.duration;

	return (
		<Card>
			<Grid container alignItems="center">
				<Grid item align="center" xs={4}>
					<img src={props.image_url} height="100%" width="100%" />
				</Grid>
				<Grid item align="center" xs={8}>
					<Typography component="h5" variant="h5">
						{props.title}
					</Typography>
					<Typography color="textSecondary" variant="subtitle1">
						{props.artist}
					</Typography>
					<div>
						<IconButton
							onClick={() => (props.is_playing ? pauseSong : playSong)}
						>
							{props.is_playing ? <Pause /> : <PlayArrow />}
						</IconButton>
						<IconButton onClick={skipSong}>
							{props.votes} / {props.votes_required} <SkipNext />
						</IconButton>
					</div>
					<Grid item xs={8}>
						<Typography variant="p" component="p" color="primary">
							host must have Spotify Premium to change playback state
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<LinearProgress variant="determinate" value={songProgress} />
		</Card>
	);
}
