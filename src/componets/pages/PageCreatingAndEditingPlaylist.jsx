import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Basic from '../Dropzone/Basic';
import { useNavigate } from 'react-router-dom';
import { useUpsertPlaylistMutation } from '../../redux/api';
import { Input } from '@mui/base/Input';
import { useParams } from "react-router-dom";
import { useGetPlaylistIdQuery } from '../../redux/api';
import { Grid, Table, TableCell, TableContainer, TableRow, TableHead, Box, Paper, Typography, TableBody } from "@mui/material";
import { IconButton } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress } from "@mui/material";
import Modal from '@mui/material/Modal';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const PageCreatingAndEditingPlaylist = () => {

    const [upsertPlaylistMutation] = useUpsertPlaylistMutation();
    let [tracksId, setTracksId] = useState([]);
    let { id } = useParams();

    if (id === undefined) {
        id = '';
    }

    const { data, isLoading, refetch } = useGetPlaylistIdQuery({ _id: id });
    const [playlist, setMyPlaylist] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    let [tracks, setTracks] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (data?.PlaylistFindOne) {
            setMyPlaylist(data?.PlaylistFindOne);
            setName(data?.PlaylistFindOne?.name || '');
            setDescription(data?.PlaylistFindOne?.description || '');
            setTracks(data?.PlaylistFindOne?.tracks || []);
            let tracksArrId = data?.PlaylistFindOne?.tracks.map(i => i._id);
            setTracksId(tracksArrId);
        }

    }, [data]);

    const handleUploadResult = (id) => {
        setTracksId(prevIds => [...prevIds, id]);
    };

    const navigate = useNavigate();

    const creatPlaylist = async () => {
        try {
            let playlistId;
            if (id !== undefined) {
                playlistId = id;
            } else {
                playlistId = '';
            }
            let newTracksId = tracksId.map(i => { let item = { _id: i }; return item });
            const res = await upsertPlaylistMutation({ playlistId: playlistId, namePls: name, descriptionPls: description, tracksId: newTracksId });
            if (res) {
                if(id === '') {
                    navigate(-1);
                } else {
                    setOpenModal(true);
                    await refetch();
                }
            }
            setName('');
            setDescription('');
        } catch (error) {
            console.error(error);
        }
    };

    const totalTracks = tracks.length || 0;
    const tracksPerPage = 5;
    const totalPages = Math.ceil(totalTracks / tracksPerPage);
    const [currentPage, setCurrentPage] = useState(1); // Стан для відстеження поточної сторінки
    const startIndex = (currentPage - 1) * tracksPerPage; // Обчислюємо індекси треків, які мають відображатись на поточній сторінці
    const endIndex = startIndex + tracksPerPage;
    const tracksToDisplay = tracks?.slice(startIndex, endIndex);

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleDelete = async (trackId) => {
        try {
            const updatedTracks = tracks.filter(i => i._id !== trackId);
            const updatedTracksId = updatedTracks.map(i => ({ _id: i._id }));
            await upsertPlaylistMutation({
                playlistId: id,
                namePls: name,
                descriptionPls: description,
                tracksId: updatedTracksId
            });
            setTracks(updatedTracks);
            await refetch();
        } catch (error) {
            console.error("Не вдалося видалити трек", error);
        }
    };

    return isLoading ?
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '100px' }}>
            <CircularProgress />
        </Box> :
        <Grid item md={10} sx={{ my: 3, mx: 10, boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)' }}>
            <Box sx={{ mx: 4, display: 'flex', flexDirection: 'column' }}>
                <>
                    {id !== '' ?
                        <Typography component="h1" variant="h4" sx={{ my: 5, mx: 4 }}>
                            Редагування плейлиста
                        </Typography>
                        :
                        <Typography component="h1" variant="h4" sx={{ my: 5, mx: 4 }}>
                            Створення плейлиста
                        </Typography>
                    }
                </>
                <Box component="form" sx={{ width: '600px' }} >
                    <Box sx={{ my: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }} >
                        <Box>
                            <Typography variant="body2" sx={{ my: 5, textAlign: 'center' }}>
                                Завантажити трек:
                            </Typography>
                        </Box>
                        <Box sx={{ mx: 9, width: '300px' }}>
                            <Basic uploadResult={handleUploadResult} />
                        </Box>
                    </Box>
                    <Grid container sx={{ my: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Grid item xs={4}   >
                            Назва плейлиста:
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Додати назву"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                        </Grid>
                    </Grid>
                    <Grid container sx={{ my: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }} >
                        <Grid item xs={4}   >
                            Опис плейлиста:
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                aria-label="Demo input"
                                multiline placeholder="Додати опис…"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ my: 5 }}>
                        <Button variant="contained" sx={{ my: 2, mx: 2 }} onClick={() => creatPlaylist()}>Зберегти</Button>
                        <Button variant="contained" sx={{ my: 2, mx: 2 }} onClick={() => navigate(-1)}>Вийти</Button>
                    </Box>
                    {id !== undefined ?
                        <>
                            <TableContainer component={Paper} sx={{ width: '100%' }} >
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
                                        {tracksToDisplay?.map((item, index) =>
                                            <TableRow key={index}>
                                                <TableCell >
                                                    <IconButton onClick={() => { handleDelete(item._id) }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell >
                                                    {item.id3 === null ? 'Без назви' : item.id3.title !== null ? item.id3.title : 'Без назви'}
                                                </TableCell>
                                                <TableCell >
                                                    {item.id3 === null ? 'Без назви' : item.id3.album !== null ? item.id3.album : 'Без назви'}
                                                </TableCell>
                                                <TableCell >
                                                    {item.id3 === null ? 'Без назви' : item.id3.artist !== null ? item.id3.artist : 'Без назви'}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Modal
                                open={openModal}
                                onClose={() => setOpenModal(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style} >
                                    <IconButton sx={{ padding: '1px', position: 'absolute', right: '0', top: '0' }} onClick={() => setOpenModal(false)}>
                                        <CloseOutlinedIcon />
                                    </IconButton>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Данні плейлиста успішно збережені.
                                    </Typography>

                                </Box>
                            </Modal>
                            <Stack spacing={2} >
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                />
                            </Stack>
                        </>
                        : null}
                </Box>
            </Box>
        </Grid>
}

export default PageCreatingAndEditingPlaylist;