import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography, Grid, Paper, IconButton, Pagination } from '@mui/material';
import { CalendarMonth, Delete } from '@mui/icons-material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Table = ({ userId }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`http://localhost:8080/api/expenses/getAll?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setTransactions(response.data.expenses);
        } else {
          console.error("Error fetching expenses:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchTransactions();
  }, [userId]);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    // Check if both start and end dates are set
    if (startDate && endDate) {
      return transactionDate >= startDate && transactionDate <= endDate;
    }
    // Default to current month if no dates are provided
    const currentDate = new Date();
    return transactionDate.getMonth() === currentDate.getMonth() && 
           transactionDate.getFullYear() === currentDate.getFullYear();
  });

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const totalIncome = filteredTransactions
    .filter(transaction => transaction.type === "Income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = filteredTransactions
    .filter(transaction => transaction.type === "Expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.delete(`http://localhost:8080/api/expenses/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setTransactions(transactions.filter(transaction => transaction._id !== id));
        console.log('Transaction deleted successfully');
      } else {
        console.error('Failed to delete transaction:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <Paper sx={{ p: 3, maxWidth: '800px', margin: '0 auto', mt: 5 }} elevation={3}>
      <main>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DatePicker
              selected={startDate}
              onChange={date => {
                setStartDate(date);
                if (endDate && date > endDate) setEndDate(null); // Reset end date if it's before the new start date
              }}
              placeholderText="Select Start Date"
              customInput={
                <Button variant="outlined" sx={{ justifyContent: 'start', textTransform: 'none' }}>
                  {startDate ? startDate.toLocaleDateString() : 'Start Date'}
                </Button>
              }
            />
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              placeholderText="Select End Date"
              customInput={
                <Button variant="outlined" sx={{ justifyContent: 'start', textTransform: 'none' }}>
                  {endDate ? endDate.toLocaleDateString() : 'End Date'}
                </Button>
              }
            />
          </Grid>
        </Grid>

        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: 'green', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  ₹{totalIncome.toFixed(2)}
                </Typography>
                <Typography color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  Income
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: 'red', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  ₹{totalExpense.toFixed(2)}
                </Typography>
                <Typography color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  Expense
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {currentTransactions.map((transaction) => (
            <Grid item xs={12} key={transaction._id}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarMonth color="action" sx={{ fontSize: { xs: '1rem', sm: '1.5rem' }, mr: 1 }} />
                  <div style={{ flex: 1 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '1.25rem' } }}>{new Date(transaction.date).toLocaleDateString()}</Typography>
                    <Typography variant="h6" sx={{ fontSize: { xs: '0.75rem', sm: '1.25rem' } }}>{transaction.description}</Typography>
                  </div>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{
                      color: transaction.type === 'Income' ? 'green' : 'red',
                      fontSize: { xs: '0.75rem', sm: '1.25rem' }
                    }}
                  >
                    {transaction.type === 'Income' ? `+₹${transaction.amount}` : `-₹${transaction.amount}`}
                  </Typography>
                  <IconButton onClick={() => handleDelete(transaction._id)} color="error" sx={{ ml: 1 }}>
                    <Delete sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }} />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Grid>
      </main>
    </Paper>
  );
};

export default Table;
