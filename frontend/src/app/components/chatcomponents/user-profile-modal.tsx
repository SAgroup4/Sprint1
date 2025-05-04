"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { X, Mail, Phone, MapPin, Calendar } from "lucide-react"
import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"

interface UserProfileModalProps {
  user: User
  onClose: () => void
}

const ProfileBanner = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 96,
  background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}))


export default function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  const router = useRouter();
  
  const handleViewProfile = () => {
    // 關閉模態框
    onClose();
    // 跳轉到用戶的個人檔案頁面
    router.push(`/profile/${user.id}`);
  };
  
  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        用戶資料
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Banner */}
          <ProfileBanner />

          {/* Avatar */}
          <Box sx={{ mt: -6, position: "relative" }}>
            <Avatar
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              sx={{
                width: 96,
                height: 96,
                border: 4,
                borderColor: "background.paper",
                boxShadow: 2,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 4,
                right: 4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: 2,
                borderColor: "background.paper",
              }}
            />
          </Box>

          {/* User info */}
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{user.name ? user.name.toLowerCase().replace(/\s+/g, "") : ""}
          </Typography>

       
          <Divider sx={{ my: 2, width: "100%" }} />

          {/* Contact info */}
          <List sx={{ width: "100%", px: 2 }}>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                <Mail size={18} />
              </ListItemIcon>
              <ListItemText primary={user.email || "沒有電子郵件"} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                <Phone size={18} />
              </ListItemIcon>
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                <MapPin size={18} />
              </ListItemIcon>
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                <Calendar size={18} />
              </ListItemIcon>
            </ListItem>
          </List>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, my: 3 }}>
            <Button variant="contained" color="primary" onClick={handleViewProfile}>
              查看資料
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
