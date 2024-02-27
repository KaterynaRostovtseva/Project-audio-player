import React, { useEffect, useState } from "react";
import { useGetPlaylistIdQuery } from '../../redux/api';
import { CircularProgress, Grid, Box, Typography, CardContent, TableBody, TableRow, TableCell, Table, TableHead, TableContainer, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { setTrack, play, stop, setPlaylist } from '../../redux/slice/playerSlice';
import PauseRounded from '@mui/icons-material/PauseRounded';


const PageSinglePlaylist = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetPlaylistIdQuery({ _id: id });
    const playerState = useSelector(state => state.persistedReducer.player);
    const [track, setTrackById] = useState(playerState.track);

    let playlist;
    if (!isLoading) {
        playlist = data;
    }
    const totalTracks = playlist?.PlaylistFindOne.tracks.length || 0;
    const tracksPerPage = 5;
    const totalPages = Math.ceil(totalTracks / tracksPerPage);
    const [currentPage, setCurrentPage] = useState(1); // Стан для відстеження поточної сторінки
    const startIndex = (currentPage - 1) * tracksPerPage; // Обчислюємо індекси треків, які мають відображатись на поточній сторінці
    const endIndex = startIndex + tracksPerPage;
    const tracksToDisplay = playlist?.PlaylistFindOne.tracks.slice(startIndex, endIndex);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isLoading) {
            dispatch(setPlaylist(playlist?.PlaylistFindOne))
        }
    }, [playlist])

    const handlePlay = (track) => {
        setTrackById(track);
        dispatch(setTrack(track));
        dispatch(play());
    };

    const handleStop = () => {
        dispatch(stop());
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return isLoading ?
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '100px' }}>
            <CircularProgress />
        </Box>
        :
        <Grid container item md={12} sx={{ mx: 5, my: 3, width: '100%' }}>
            <Box>
                <CardContent md={12} sx={{ my: 1, width: '100%' }} >
                    <Typography gutterBottom variant="h4" component="div">
                        {playlist.PlaylistFindOne.name || 'No Name'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data.PlaylistFindOne.description || 'No Description'}
                    </Typography>
                </CardContent>
            </Box>
            <Grid container item md={12} sx={{ mx: 1 }}>
                <Typography gutterBottom variant="h6" component="div" sx={{ mx: 1, my: 5 }}>Треки</Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><IconButton /></TableCell>
                                <TableCell>Назва</TableCell>
                                <TableCell>Альбом</TableCell>
                                <TableCell>Виконавець</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tracksToDisplay.map((item, index) =>
                                <TableRow key={index}>
                                    <TableCell>
                                        {playerState.track._id === item._id && playerState.isPlaying === true ?
                                            <IconButton onClick={() => { handleStop() }}>
                                                <PauseRounded />
                                            </IconButton>
                                            :
                                            <IconButton onClick={() => { handlePlay(item) }}>
                                                <PlayArrow />
                                            </IconButton>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {item.id3 === null ? 'Без назви' : item.id3.title !== null ? item.id3.title : 'Без назви'}
                                    </TableCell>
                                    <TableCell>
                                        {item.id3 === null ? 'Без назви' : item.id3.album !== null ? item.id3.album : 'Без назви'}
                                    </TableCell>
                                    <TableCell>
                                        {item.id3 === null ? 'Без назви' : item.id3.artist !== null ? item.id3.artist : 'Без назви'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack spacing={2} sx={{ my: 3 }} >
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                    />
                </Stack>
            </Grid>
        </Grid>
};

export default PageSinglePlaylist;



