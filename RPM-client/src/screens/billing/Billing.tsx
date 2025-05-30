import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  IconButton,
  InputAdornment,
  Stack
} from '@mui/material';
import { 
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Description as InvoiceIcon
} from '@mui/icons-material';

interface Payment {
  id: string;
  date: string;
  request: string;
  amount: number;
  status: 'FUNDS_HELD' | 'RELEASED' | 'REFUNDED';
  txnId: string;
  invoiceUrl: string | null;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  request: string;
  amount: number;
  invoiceUrl: string;
}

// Mock data service
const mockPayments: Payment[] = [
  {
    id: '1',
    date: '2024-05-15',
    request: 'Self-service Ordering System',
    amount: 500,
    status: 'RELEASED',
    txnId: 'pay_123',
    invoiceUrl: '/invoices/pay_123.pdf'
  },
  {
    id: '2',
    date: '2024-05-20',
    request: 'Therapist Notes Agent',
    amount: 750,
    status: 'FUNDS_HELD',
    txnId: 'pay_456',
    invoiceUrl: null
  },
  {
    id: '3',
    date: '2024-05-22',
    request: 'Refund – Therapist Notes Agent',
    amount: -75,
    status: 'REFUNDED',
    txnId: 'ref_789',
    invoiceUrl: null
  },
  {
    id: '4',
    date: '2024-05-25',
    request: 'Customer Analytics Dashboard',
    amount: 1200,
    status: 'RELEASED',
    txnId: 'pay_789',
    invoiceUrl: '/invoices/pay_789.pdf'
  },
  {
    id: '5',
    date: '2024-05-28',
    request: 'Inventory Management System',
    amount: 950,
    status: 'RELEASED',
    txnId: 'pay_101',
    invoiceUrl: '/invoices/pay_101.pdf'
  },
  {
    id: '6',
    date: '2024-06-01',
    request: 'E-commerce Integration',
    amount: 800,
    status: 'FUNDS_HELD',
    txnId: 'pay_202',
    invoiceUrl: null
  },
  {
    id: '7',
    date: '2024-06-05',
    request: 'Mobile App Development',
    amount: 1500,
    status: 'RELEASED',
    txnId: 'pay_303',
    invoiceUrl: '/invoices/pay_303.pdf'
  },
  {
    id: '8',
    date: '2024-06-08',
    request: 'AI Chatbot Implementation',
    amount: 600,
    status: 'FUNDS_HELD',
    txnId: 'pay_404',
    invoiceUrl: null
  },
  {
    id: '9',
    date: '2024-06-12',
    request: 'Database Optimization',
    amount: 400,
    status: 'RELEASED',
    txnId: 'pay_505',
    invoiceUrl: '/invoices/pay_505.pdf'
  },
  {
    id: '10',
    date: '2024-06-15',
    request: 'Security Audit Service',
    amount: 350,
    status: 'RELEASED',
    txnId: 'pay_606',
    invoiceUrl: '/invoices/pay_606.pdf'
  },
  {
    id: '11',
    date: '2024-06-18',
    request: 'Cloud Migration Service',
    amount: 1100,
    status: 'FUNDS_HELD',
    txnId: 'pay_707',
    invoiceUrl: null
  },
  {
    id: '12',
    date: '2024-06-20',
    request: 'Performance Monitoring',
    amount: 275,
    status: 'RELEASED',
    txnId: 'pay_808',
    invoiceUrl: '/invoices/pay_808.pdf'
  }
];

const mockInvoices: Invoice[] = mockPayments
  .filter(payment => payment.status === 'RELEASED' && payment.invoiceUrl)
  .map((payment, index) => ({
    id: payment.id,
    invoiceNumber: `INV-2024-${String(index + 1).padStart(4, '0')}`,
    date: payment.date,
    request: payment.request,
    amount: payment.amount,
    invoiceUrl: payment.invoiceUrl!
  }));

const ROWS_PER_PAGE = 10;

const Billing: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  
  // Filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // Pagination states
  const [paymentPage, setPaymentPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);

  // Load mock data
  useEffect(() => {
    setPayments(mockPayments);
    setInvoices(mockInvoices);
  }, []);

  // Filter payments
  useEffect(() => {
    let filtered = payments;

    // Keyword search
    if (searchKeyword) {
      filtered = filtered.filter(payment =>
        payment.request.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(payment => new Date(payment.date) >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(payment => new Date(payment.date) <= endDate);
    }

    setFilteredPayments(filtered);
    setPaymentPage(1); // Reset to first page when filters change
  }, [payments, searchKeyword, statusFilter, startDate, endDate]);

  // Filter invoices
  useEffect(() => {
    let filtered = invoices;

    // Keyword search
    if (searchKeyword) {
      filtered = filtered.filter(invoice =>
        invoice.request.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(invoice => new Date(invoice.date) >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(invoice => new Date(invoice.date) <= endDate);
    }

    setFilteredInvoices(filtered);
    setInvoicePage(1); // Reset to first page when filters change
  }, [invoices, searchKeyword, startDate, endDate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FUNDS_HELD':
        return 'warning';
      case 'RELEASED':
        return 'success';
      case 'REFUNDED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'FUNDS_HELD':
        return 'Funds Held';
      case 'RELEASED':
        return 'Released';
      case 'REFUNDED':
        return 'Refunded';
      default:
        return status;
    }
  };

  const handleDownload = (url: string) => {
    // In a real app, this would trigger a download
    window.open(url, '_blank');
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setStatusFilter('ALL');
    setStartDate(null);
    setEndDate(null);
  };

  // Pagination calculations
  const paginatedPayments = filteredPayments.slice(
    (paymentPage - 1) * ROWS_PER_PAGE,
    paymentPage * ROWS_PER_PAGE
  );

  const paginatedInvoices = filteredInvoices.slice(
    (invoicePage - 1) * ROWS_PER_PAGE,
    invoicePage * ROWS_PER_PAGE
  );

  const paymentPageCount = Math.ceil(filteredPayments.length / ROWS_PER_PAGE);
  const invoicePageCount = Math.ceil(filteredInvoices.length / ROWS_PER_PAGE);

  const EmptyState: React.FC<{ type: 'payments' | 'invoices' }> = ({ type }) => (
    <Box sx={{ 
      textAlign: 'center', 
      py: 8,
      px: 4
    }}>
      {type === 'payments' ? (
        <ReceiptIcon sx={{ fontSize: 64, color: '#7442BF', mb: 2, opacity: 0.5 }} />
      ) : (
        <InvoiceIcon sx={{ fontSize: 64, color: '#7442BF', mb: 2, opacity: 0.5 }} />
      )}
      <Typography variant="h6" gutterBottom sx={{ color: '#495057' }}>
        {type === 'payments' ? 'No payments yet' : 'No invoices yet'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {type === 'payments' 
          ? 'Complete your first request to see billing history.'
          : 'Invoices will appear here once payments are released.'
        }
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)', 
        color: 'white' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <ReceiptIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Billing & Invoices
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Manage your subscription, view invoices, and payment history
        </Typography>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            }
          }}
        >
          <Tab label="Payments" />
          <Tab label="Invoices" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              placeholder="Search by request name..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />

            {currentTab === 0 && (
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Statuses</MenuItem>
                  <MenuItem value="RELEASED">Released</MenuItem>
                  <MenuItem value="FUNDS_HELD">Funds Held</MenuItem>
                  <MenuItem value="REFUNDED">Refunded</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              label="Start Date"
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            
            <TextField
              label="End Date"
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />

            <Button 
              variant="outlined" 
              onClick={clearFilters}
              sx={{ 
                color: '#7442BF',
                borderColor: '#7442BF',
                '&:hover': {
                  borderColor: '#5e3399',
                  backgroundColor: 'rgba(116, 66, 191, 0.04)'
                }
              }}
            >
              Clear Filters
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {currentTab === 0 ? (
        <Paper>
          {paginatedPayments.length > 0 ? (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Request Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount (USD)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPayments.map((payment) => (
                      <TableRow key={payment.id} hover>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{payment.request}</TableCell>
                        <TableCell>
                          <Typography 
                            color={payment.amount < 0 ? 'error' : 'inherit'}
                            sx={{ fontWeight: payment.amount < 0 ? 600 : 400 }}
                          >
                            {payment.amount < 0 ? '-' : ''}{formatCurrency(payment.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusLabel(payment.status)}
                            color={getStatusColor(payment.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {payment.txnId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {payment.status === 'RELEASED' && payment.invoiceUrl ? (
                            <Button
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownload(payment.invoiceUrl!)}
                              sx={{ 
                                color: '#7442BF',
                                '&:hover': {
                                  backgroundColor: 'rgba(116, 66, 191, 0.1)'
                                }
                              }}
                            >
                              Download Invoice
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              -
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {paymentPageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <Pagination
                    count={paymentPageCount}
                    page={paymentPage}
                    onChange={(e, page) => setPaymentPage(page)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <EmptyState type="payments" />
          )}
        </Paper>
      ) : (
        <Paper>
          {paginatedInvoices.length > 0 ? (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Request Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Download</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedInvoices.map((invoice) => (
                      <TableRow key={invoice.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#7442BF' }}>
                            {invoice.invoiceNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell>{invoice.request}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleDownload(invoice.invoiceUrl)}
                            sx={{ 
                              color: '#7442BF',
                              '&:hover': {
                                backgroundColor: 'rgba(116, 66, 191, 0.1)'
                              }
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {invoicePageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <Pagination
                    count={invoicePageCount}
                    page={invoicePage}
                    onChange={(e, page) => setInvoicePage(page)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <EmptyState type="invoices" />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Billing; 