import React, { useEffect, useState } from 'react';
import BarChart from '../components/chart'; 
import axios from 'axios';
import DoughnutChart from '../components/piechart';
import IncomeDoughnutChart from '../components/incomepiechart';
import CMDC from '../components/currentmonthpiechart';
import CMIDC from '../components/currentmonthincomepiechart';
import { Box, Typography, useMediaQuery } from '@mui/material';

const Dashboard = ({ userId }) => {
  const [chartData, setChartData] = useState({
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 
      'May', 'Jun', 'Jul', 'Aug', 
      'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [{
      label: 'Monthly Expenses',
      data: new Array(12).fill(0), 
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  });

  const isMobile = useMediaQuery('(max-width:768px)'); 

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`https://budget-buddy-gho3.onrender.com/api/expenses/getAll?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const expenses = response.data.expenses;
          const monthlyExpenses = new Array(12).fill(0);

          expenses.forEach((expense) => {
            const expenseDate = new Date(expense.date);
            const month = expenseDate.getMonth();
            
            if (expense.type === 'Expense') {
              monthlyExpenses[month] += expense.amount;
            }
          });

          setChartData((prevData) => ({
            ...prevData,
            datasets: [{
              ...prevData.datasets[0],
              data: monthlyExpenses
            }]
          }));
        } else {
          console.error("Error fetching expenses:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h6" gutterBottom>
        My Chart
      </Typography>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          gap: 2,
          marginTop: 2
        }}
      >
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: isMobile ? '250px': '400px'
          }}
        >
          <CMDC userId={userId} />
        </Box>
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: isMobile ? '250px' : '400px' 
          }}
        >
          <CMIDC userId={userId} />
        </Box>
      </Box>

      <Box sx={{ width: '100%', marginBottom: 2 }}>
        <BarChart data={chartData} />
      </Box>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          gap: 2,
          marginTop: 2
        }}
      >
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: isMobile ? '250px': '400px'
          }}
        >
          <DoughnutChart userId={userId} />
        </Box>
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: isMobile ? '250px' : '400px' 
          }}
        >
          <IncomeDoughnutChart userId={userId} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
