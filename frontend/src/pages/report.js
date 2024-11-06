import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { TextField, Button, Grid, Box, Paper } from '@mui/material';

const Report = ({ userId }) => {
    const [expenses, setExpenses] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchExpenses = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`http://localhost:8080/api/expenses/getAll?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setExpenses(response.data.expenses);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, [userId]);

    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return expenseDate >= start && expenseDate <= end;
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Expense Report", 14, 15);
        
        doc.setFontSize(12);
        doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 25);
        
        const tableColumn = ["Date", "Category", "Amount", "Description", "Type"];
        const tableRows = [];

        filteredExpenses.forEach(expense => {
            const expenseData = [
                new Date(expense.date).toLocaleDateString(),
                expense.category,
                expense.amount,
                expense.description,
                expense.type
            ];
            tableRows.push(expenseData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] }, 
            styles: { fontSize: 10, cellPadding: 3 },  
            margin: { top: 10 },
        });

        doc.save("expenses_report.pdf");
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, maxWidth: '500px', margin: 'auto', marginTop: 3 }}>
            <h4>Download Your Report Here</h4>
            <Box component="form" noValidate sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Start Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="End Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={exportToPDF}
                        >
                            Export Data to PDF
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default Report;
