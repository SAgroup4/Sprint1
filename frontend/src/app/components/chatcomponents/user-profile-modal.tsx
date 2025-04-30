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

const StatusBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOnline",
})<{ isOnline: boolean }>(({ theme, isOnline }) => ({
  display: "inline-block",
  padding: theme.spacing(0.5, 2),
  borderRadius: 16,
  backgroundColor: isOnline ? theme.palette.secondary.light : theme.palette.grey[200],
  color: isOnline ? theme.palette.primary.dark : theme.palette.text.secondary,
  fontSize: 14,
}))

export default function UserProfileModal({ user, onClose }: UserProfileModalProps) {
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
                bgcolor: user.status === "online" ? "success.main" : "grey.400",
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
            @{user.username || user.name.toLowerCase().replace(/\s+/g, "")}
          </Typography>

          {/* Status */}
          <Box sx={{ mt: 2 }}>
            <StatusBadge isOnline={user.status === "online"}>{user.status === "online" ? "在線" : "離線"}</StatusBadge>
          </Box>

          {/* Bio */}
          <Typography variant="body2" sx={{ mt: 2, px: 4, textAlign: "center" }}>
            {user.bio || "沒有個人簡介"}
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
              <ListItemText primary={user.phone || "沒有電話"} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                <MapPin size={18} />
              </ListItemIcon>
              <ListItemText primary={user.location || "沒有位置"} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                <Calendar size={18} />
              </ListItemIcon>
              <ListItemText primary={`加入時間 ${user.joinDate || "未知"}`} />
            </ListItem>
          </List>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, my: 3 }}>
            <Button variant="contained" color="primary">
              發送訊息
            </Button>
            <Button variant="outlined" color="primary">
              查看資料
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
