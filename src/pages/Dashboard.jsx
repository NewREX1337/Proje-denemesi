import { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    ThemeProvider,
    createTheme,
    CssBaseline,
    TableContainer,
    TextField,
    Menu,
    MenuItem,
    Button,
} from "@mui/material";
import { Delete, Block, Search, LockOpen } from "@mui/icons-material";

const BASE_URL = "http://localhost:3005";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#1976d2" },
        secondary: { main: "#d32f2f" },
    },
    shape: { borderRadius: 12 },
});

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const getAllUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users`);
            setUsers(response.data);
        } catch (error) {
            console.error("Kullanıcılar alınamadı:", error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Kullanıcı silinemedi:", error);
        }
    };

    const banUser = async (id, duration) => {
        try {
            let banEndDate = null;
            if (duration) {
                banEndDate = new Date(Date.now() + duration).toISOString();
            }
            await axios.patch(`${BASE_URL}/users/${id}`, {
                status: "banned",
                banEndDate,
            });
            setUsers(
                users.map((user) =>
                    user.id === id ? { ...user, status: "banned", banEndDate } : user
                )
            );
        } catch (error) {
            console.error("Kullanıcı yasaklanamadı:", error);
        }
    };

    const unbanUser = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/users/${id}`, {
                status: "active",
                banEndDate: null,
            });
            setUsers(
                users.map((user) =>
                    user.id === id ? { ...user, status: "active", banEndDate: null } : user
                )
            );
        } catch (error) {
            console.error("Ban kaldırılamadı:", error);
        }
    };

    const handleBanMenu = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleBanClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.id.toString().includes(search)
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Kullanıcı Listesi
                </Typography>

                {/* Arama */}
                <TextField
                    label="Kullanıcı adı veya ID ara"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1 }} />,
                    }}
                />

                <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>ID</b></TableCell>
                                <TableCell><b>Kullanıcı Adı</b></TableCell>
                                <TableCell><b>Şifre</b></TableCell>
                                <TableCell><b>Durum</b></TableCell>
                                <TableCell align="center"><b>İşlemler</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.password}</TableCell>
                                        <TableCell>
                                            {user.status === "banned"
                                                ? `Banned ${user.banEndDate
                                                    ? `(Bitiş: ${new Date(
                                                        user.banEndDate
                                                    ).toLocaleString()})`
                                                    : "(Kalıcı)"
                                                }`
                                                : "Aktif"}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="secondary"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                <Delete />
                                            </IconButton>

                                            {user.status === "banned" ? (
                                                <IconButton
                                                    color="success"
                                                    onClick={() => unbanUser(user.id)}
                                                >
                                                    <LockOpen />
                                                </IconButton>
                                            ) : (
                                                <>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={(e) => handleBanMenu(e, user)}
                                                    >
                                                        <Block />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="5" align="center">
                                        Kullanıcı bulunamadı
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Ban Süresi Menüsü */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleBanClose}
                >
                    <MenuItem
                        onClick={() => {
                            banUser(selectedUser.id, 60 * 60 * 1000); // 1 saat
                            handleBanClose();
                        }}
                    >
                        1 Saat Ban
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            banUser(selectedUser.id, 24 * 60 * 60 * 1000); // 1 gün
                            handleBanClose();
                        }}
                    >
                        1 Gün Ban
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            banUser(selectedUser.id, null); // Kalıcı ban
                            handleBanClose();
                        }}
                    >
                        Kalıcı Ban
                    </MenuItem>
                </Menu>
            </Container>
        </ThemeProvider>
    );
}

export default Dashboard;
