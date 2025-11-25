import { Box, Button, Paper, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AVATAR_SIZE = 72;

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box position="relative" minHeight="100vh" width="100vw">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={2} sx={{ p: 3, width: 320 }}>
          <Box textAlign="center" mb={2}>
            <Box display="flex" justifyContent="center" mb={1}>
              <Avatar
                src="https://cdn-icons-png.flaticon.com/128/6948/6948529.png"
                alt="Loja de Produtos"
                sx={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  bgcolor: "transparent",
                }}
                slotProps={{ img: { loading: "lazy" } }}
              />
            </Box>
            <Typography variant="h5" component="h1" fontWeight={600} mb={2}>
              Loja de Produtos
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              type="button"
              onClick={() => navigate("/clientes")}
            >
              Clientes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              type="button"
            >
              Categoria
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;