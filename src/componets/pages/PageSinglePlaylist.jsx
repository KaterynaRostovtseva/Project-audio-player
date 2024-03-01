import React, { useEffect, useState } from "react";
import { useGetPlaylistIdQuery } from '../../redux/api';
import { CircularProgress, Grid, Box, Typography, CardContent, TableBody, TableRow, TableCell, Table, TableHead, TableContainer, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { setTrack, play, stop, setPlaylist } from '../../redux/slice/playerSlice';
import PauseRounded from '@mui/icons-material/PauseRounded';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const PageSinglePlaylist = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetPlaylistIdQuery({ _id: id });
    const playerState = useSelector(state => state.persistedReducer.player);
    const [playlist, setMyPlaylist] = useState(null);
    const [track, setTrackById] = useState(playerState.track);
    const [tracks, setTracks] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data?.PlaylistFindOne) {
            setMyPlaylist(data);
            dispatch(setPlaylist(data?.PlaylistFindOne))
            setTracks(data?.PlaylistFindOne?.tracks || []);
        }
    }, [data])

    const handlePlay = (track) => {
        setTrackById(track);
        dispatch(setTrack(track));
        dispatch(play());
    };

    const handleStop = () => {
        dispatch(stop());
    };

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const newTracks = [...tracks];
        const [reorderedItem] = newTracks.splice(result.source.index, 1);
        newTracks.splice(result.destination.index, 0, reorderedItem);
        setTracks(newTracks);
    };


    return isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '100px' }}>
            <CircularProgress />
        </Box>
    ) : (
        <>
            <Grid container item md={10} sx={{mx:5, my: 3, width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box>
                        <CardContent md={12} sx={{ my: 1, width: '100%' }} >
                            <Typography gutterBottom variant="h4" component="div">
                                {playlist?.PlaylistFindOne.name || 'No Name'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data.PlaylistFindOne.description || 'No Description'}
                            </Typography>
                        </CardContent>
                    </Box>
                </Box>
                <Grid container item md={10} sx={{ mx: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mx: 1, my: 1 }}>Треки</Typography>
                    <DragDropContext onDragEnd={handleDragEnd}>
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
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                            {tracks.map((item, index) => (
                                                <Draggable key={item._id} draggableId={item._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <TableRow
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                backgroundColor: snapshot.isDragging ? 'lightgrey' : 'inherit',
                                                            }}
                                                        >
                                                            <TableCell>
                                                                {playerState.track?._id === item._id && playerState.isPlaying === true ?
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
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </TableBody>
                                    )}
                                </Droppable>
                            </Table>
                        </TableContainer>
                    </DragDropContext>
                </Grid>
            </Grid>
            <div style={{height: '210px', width: '100%'}}></div>
        </>
    )
};

export default PageSinglePlaylist;