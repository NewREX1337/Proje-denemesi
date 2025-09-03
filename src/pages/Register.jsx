import React, { useState } from 'react';
import { Button, TextField, Box } from "@mui/material";
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const fieldStyle = {
        '& .MuiInputBase-input': { color: '#000' },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#000' },
            '&:hover fieldset, &.Mui-focused fieldset': { borderColor: '#ffffffff' },
        },
        '& .MuiInputLabel-root': { color: '#000' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#ffffffff' },
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setMessage("❌ Şifreler uyuşmuyor!");
            return;
        }

        try {
            // Kullanıcı var mı kontrol et
            const res = await axios.get("http://localhost:3005/users", {
                params: { username }
            });

            if (res.data.length > 0) {
                setMessage("❌ Bu kullanıcı adı zaten alınmış!");
                return;
            }

            // Yeni kullanıcı ekle
            await axios.post("http://localhost:3005/users", {
                username,
                password
            });

            setMessage("✅ Kayıt başarılı! Giriş yapabilirsiniz.");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(err);
            setMessage("⚠️ Sunucu hatası!");
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} width={250} margin="50px auto"
            sx={{ backgroundColor: 'rgba(82, 82, 82, 0.5)', padding: 3, borderRadius: 2 }}>

            <TextField label="Username" variant="outlined" sx={fieldStyle}
                value={username} onChange={(e) => setUsername(e.target.value)} />

            <TextField label="Password" type="password" variant="outlined" sx={fieldStyle}
                value={password} onChange={(e) => setPassword(e.target.value)} />

            <TextField label="Confirm Password" type="password" variant="outlined" sx={fieldStyle}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            <Button onClick={handleRegister} variant="contained"
                sx={{ backgroundColor: 'hsla(0, 0%, 27%, 0.49)', '&:hover': { backgroundColor: '#b3b3b3a9' } }}>
                Register
            </Button>
            <p style={{ color: "white", margin: "0" }}>{message}</p>
        </Box>
    )
}

export default Register;
