"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@mui/material"
import { X, UserPlus } from "lucide-react"

import { addContact } from '../../../lib/api';

interface AddContactModalProps {
  onClose: () => void
  onAddContact: (studentId: string) => void
}

export default function AddContactModal({ onClose, onAddContact }: AddContactModalProps) {
  const [studentId, setStudentId] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!studentId.trim()) {
      setError("請輸入學號")
      return
    }

    // Validate student ID format (example: must be 8-10 digits)
    if (!/^\d{8,10}$/.test(studentId)) {
      setError("學號格式不正確，請輸入8-10位數字")
      return
    }

    onAddContact(studentId)
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.main" }}>
        <UserPlus size={20} />
        新增聯絡人
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", right: 8, top: 8 }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="studentId"
            label="學號"
            type="text"
            fullWidth
            variant="outlined"
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value)
              setError("")
            }}
            error={!!error}
            helperText={error}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: error ? "error.main" : "primary.light",
                },
                "&:hover fieldset": {
                  borderColor: error ? "error.main" : "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: error ? "error.main" : "primary.main",
                },
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            輸入對方的學號來新增聯絡人。新增後即可開始對話。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined" color="primary">
            取消
          </Button>
          <Button type="submit" variant="contained" color="primary">
            新增
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

