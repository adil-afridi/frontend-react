import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const CrudApp = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch items from the backend
  const fetchItems = async () => {
    const response = await fetch("https://backend-node-wheat.vercel.app/api/users");
    const data = await response.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open dialog for add or edit
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({ name: "", email: "" });
    setIsEditing(false);
  };

  // Add or update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update existing item
      await fetch(`https://backend-node-wheat.vercel.app/api/users/${currentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === currentId ? { ...item, ...formData } : item
        )
      );
    } else {
      // Add new item
      const response = await fetch("https://backend-node-wheat.vercel.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const newItem = await response.json();
      setItems((prevItems) => [...prevItems, newItem]);
    }
    handleDialogClose();
  };

  // Edit an item
  const handleEdit = (item) => {
    setFormData({ name: item.name, email: item.email });
    setCurrentId(item.id);
    setIsEditing(true);
    handleDialogOpen();
  };

  // Delete an item
  const handleDelete = async (id) => {
    await fetch(`https://backend-node-wheat.vercel.app/api/users/${id}`, {
      method: "DELETE",
    });
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="container">
      <h1 style={{ color: "#000" }}>User Management</h1>

      {/* Button to open dialog for adding user */}
      <Button
        variant="contained"
        color="success"
        onClick={handleDialogOpen}
        style={{ marginBottom: "20px", marginRight: "-76%" }}
      >
        Add User
      </Button>

      {/* Dialog for add/edit */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            style={{ marginBottom: "10px" }}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
            style={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display list of items */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CrudApp;
