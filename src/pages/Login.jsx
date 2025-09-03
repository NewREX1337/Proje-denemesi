import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const users = [
    {
        username: "NewREX",
        password: "1337"
    }
]

function Login() {
    const [username, setUsername] = useState(""); // Kullanıcının girdiği username değerini tutan state
    const [password, setPassword] = useState(""); // Kullanıcının girdiği password değerini tutan state
    const [error, setError] = useState("");       // Hatalı giriş olduğunda ekranda göstereceğimiz hata mesajı için state

    const navigate = useNavigate(); //yönlendirme için

    const fieldStyle = {
        '& .MuiInputBase-input': { color: '#000' },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#000' },
            '&:hover fieldset, &.Mui-focused fieldset': { borderColor: '#ffffffff' },
        },
        '& .MuiInputLabel-root': { color: '#000' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#ffffffff' },
    };

    const handleLogin = () => {
        const foundUser = users.find(
            (u) => u.username === username && u.password === password
        );

        if (foundUser) {
            navigate("/home"); //  GİRİŞ DOĞRUYSA YÖNLENDİRİCEK
        } else {
            setError("Retry!"); // GİRİŞTE HATA MESAJI
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
            width={250}
            margin="50px auto"
            sx={{ backgroundColor: 'rgba(82, 82, 82, 0.5)', padding: 3, borderRadius: 2 }}
        >
            <TextField
                label="Username"
                variant="outlined"
                sx={fieldStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                sx={fieldStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            <Button
                variant="contained"
                onClick={handleLogin}
                sx={{
                    backgroundColor: 'hsla(0, 0%, 27%, 0.49)',
                    '&:hover': { backgroundColor: '#b3b3b3a9' },
                }}
            >
                Sign In
            </Button>
        </Box>
    );
}

export default Login;
