
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { useState } from 'react';

import './AddVideoButton.css';
import TextField from '@mui/material/TextField';
import { useVideosContext } from '../../hooks/useVideosContext';
import Snackbar from '@mui/material/Snackbar';

const strings = {
    addVideo: "Add Video",
    modalTitle: "Add a New Video",
    titleLabel: "Title",
    tagsLabel: "Tags",
    tagsHelperText: "Separate tags with commas (e.g. comedy, music, education)",
    submitButton: "Submit",
    successMessage: "Video added successfully",
}

export default function AddVideoButton() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    
    const { addVideo } = useVideosContext();


    const onSubmit = () => {
        addVideo(title, tags, () => {
            setOpen(false);
            setTitle("");
            setTags([]);
            setSnackbarOpen(true);
        });
    }

    return (
        <>
            <Button 
                className="add-video-button" 
                onClick={() => setOpen(true)}
                variant='contained'>
                {strings.addVideo}
            </Button>

            <Modal 
                open={open} 
                onClose={() => setOpen(false)}
                closeAfterTransition>
                <Fade in={open}>
                    <Box className="modal-container">
                        <Typography 
                            variant="h6" 
                            component="h2">
                            {strings.modalTitle}
                        </Typography>
                        <Box 
                            className="input-group"
                            component="form">
                            <TextField
                                id="outlined-basic" 
                                label={strings.titleLabel} 
                                variant="outlined" 
                                fullWidth
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <TextField 
                                id="outlined-basic" 
                                label={strings.tagsLabel} 
                                variant="outlined" 
                                fullWidth
                                helperText={strings.tagsHelperText}
                                onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()))}
                            />
                            <Button 
                                variant='contained'
                                onClick={onSubmit}
                            >
                                {strings.submitButton}
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={strings.successMessage}
            />
        </>
    )
}