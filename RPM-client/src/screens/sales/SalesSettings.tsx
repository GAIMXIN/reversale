import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Alert,
  Paper,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  AccountCircle as ProfileIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  accountType: 'checking' | 'savings';
  isDefault: boolean;
  addedDate: string;
}

interface PaymentSettings {
  autoWithdraw: boolean;
  minimumBalance: number;
  withdrawalDay: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const SalesSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [showAddBankDialog, setShowAddBankDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // 个人信息状态
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    taxId: '',
  });

  // 银行账户数据
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      routingNumber: '021000021',
      accountHolderName: user?.name || '',
      accountType: 'checking',
      isDefault: true,
      addedDate: '2024-01-15',
    }
  ]);

  // 新银行账户表单
  const [newBankAccount, setNewBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: user?.name || '',
    accountType: 'checking' as 'checking' | 'savings',
  });

  // 支付设置
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    autoWithdraw: true,
    minimumBalance: 500,
    withdrawalDay: 'friday',
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProfileSave = () => {
    // 保存个人信息逻辑
    setSaveMessage('Profile information saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleAddBankAccount = () => {
    if (!newBankAccount.bankName || !newBankAccount.accountNumber || !newBankAccount.routingNumber) {
      return;
    }

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      ...newBankAccount,
      accountNumber: `****${newBankAccount.accountNumber.slice(-4)}`,
      isDefault: bankAccounts.length === 0,
      addedDate: new Date().toISOString().split('T')[0],
    };

    setBankAccounts([...bankAccounts, newAccount]);
    setNewBankAccount({
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountHolderName: user?.name || '',
      accountType: 'checking',
    });
    setShowAddBankDialog(false);
    setSaveMessage('Bank account added successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleDeleteBankAccount = () => {
    if (selectedBankId) {
      setBankAccounts(bankAccounts.filter(account => account.id !== selectedBankId));
      setShowDeleteDialog(false);
      setSelectedBankId(null);
      setSaveMessage('Bank account deleted!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleSetDefaultAccount = (accountId: string) => {
    setBankAccounts(bankAccounts.map(account => ({
      ...account,
      isDefault: account.id === accountId
    })));
    setSaveMessage('Default account updated!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handlePaymentSettingsSave = () => {
    // 保存支付设置逻辑
    setSaveMessage('Payment settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const TabPanel = ({ children, value, index }: { children: React.ReactNode, value: number, index: number }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 4 }}>
        Settings Center
      </Typography>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 72,
              fontSize: '1rem',
              fontWeight: 500,
            }
          }}
        >
          <Tab 
            icon={<ProfileIcon />} 
            label="Personal Information" 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            icon={<PaymentIcon />} 
            label="Payment Settings" 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            icon={<NotificationsIcon />} 
            label="Notification Settings" 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
        </Tabs>

        {/* 个人信息标签页 */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Personal Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Tax ID (SSN/TIN)"
                    value={profileData.taxId}
                    onChange={(e) => setProfileData({...profileData, taxId: e.target.value})}
                  />
                </Box>
              </Box>
              
              <Box>
                <TextField
                  fullWidth
                  label="Address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="City"
                    value={profileData.city}
                    onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={profileData.state}
                    onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                  />
                </Box>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({...profileData, zipCode: e.target.value})}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                onClick={handleProfileSave}
                sx={{
                  bgcolor: '#7442BF',
                  '&:hover': { bgcolor: '#5e3399' },
                  px: 4,
                  py: 1.5,
                }}
              >
                Save Information
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* 支付设置标签页 */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            {/* 银行账户管理 */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Bank Account Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={showAccountNumbers ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    onClick={() => setShowAccountNumbers(!showAccountNumbers)}
                    size="small"
                  >
                    {showAccountNumbers ? 'Hide' : 'Show'} Account Number
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddBankDialog(true)}
                    sx={{
                      bgcolor: '#7442BF',
                      '&:hover': { bgcolor: '#5e3399' },
                    }}
                  >
                    Add Bank Account
                  </Button>
                </Box>
              </Box>

              <List>
                {bankAccounts.map((account) => (
                  <ListItem 
                    key={account.id}
                    sx={{ 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 2, 
                      mb: 2,
                      bgcolor: account.isDefault ? 'rgba(116, 66, 191, 0.05)' : 'transparent'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <BankIcon color="primary" />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {account.bankName}
                          </Typography>
                          {account.isDefault && (
                            <Chip label="Default" size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Account Holder: {account.accountHolderName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Account Number: {showAccountNumbers ? account.accountNumber.replace('****', '1234567890').slice(0, -4) + '****' : account.accountNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Routing Number: {account.routingNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Account Type: {account.accountType === 'checking' ? 'Checking Account' : 'Savings Account'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Added Date: {account.addedDate}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!account.isDefault && (
                          <Button
                            size="small"
                            onClick={() => handleSetDefaultAccount(account.id)}
                            sx={{ textTransform: 'none' }}
                          >
                            Set as Default
                          </Button>
                        )}
                        <IconButton
                          onClick={() => {
                            setSelectedBankId(account.id);
                            setShowDeleteDialog(true);
                          }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 支付设置 */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Withdrawal Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paymentSettings.autoWithdraw}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          autoWithdraw: e.target.checked
                        })}
                      />
                    }
                    label="Enable Automatic Withdrawal"
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                    <TextField
                      fullWidth
                      label="Minimum Withdrawal Amount ($)"
                      type="number"
                      value={paymentSettings.minimumBalance}
                      onChange={(e) => setPaymentSettings({
                        ...paymentSettings,
                        minimumBalance: Number(e.target.value)
                      })}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                    <TextField
                      fullWidth
                      select
                      label="Withdrawal Day"
                      value={paymentSettings.withdrawalDay}
                      onChange={(e) => setPaymentSettings({
                        ...paymentSettings,
                        withdrawalDay: e.target.value
                      })}
                      SelectProps={{ native: true }}
                    >
                      <option value="monday">Monday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="friday">Friday</option>
                      <option value="monthly">1st of the Month</option>
                    </TextField>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  onClick={handlePaymentSettingsSave}
                  sx={{
                    bgcolor: '#7442BF',
                    '&:hover': { bgcolor: '#5e3399' },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Save Settings
                </Button>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* 通知设置标签页 */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Notification Preference Settings
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.emailNotifications}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      emailNotifications: e.target.checked
                    })}
                  />
                }
                label="Email Notification - Receive commission and withdrawal notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.smsNotifications}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      smsNotifications: e.target.checked
                    })}
                  />
                }
                label="SMS Notification - Receive important transaction reminders"
              />
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                onClick={handlePaymentSettingsSave}
                sx={{
                  bgcolor: '#7442BF',
                  '&:hover': { bgcolor: '#5e3399' },
                  px: 4,
                  py: 1.5,
                }}
              >
                Save Settings
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </Paper>

      {/* 添加银行账户对话框 */}
      <Dialog 
        open={showAddBankDialog} 
        onClose={() => setShowAddBankDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCardIcon color="primary" />
            Add Bank Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Bank Name"
              value={newBankAccount.bankName}
              onChange={(e) => setNewBankAccount({...newBankAccount, bankName: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Account Holder Name"
              value={newBankAccount.accountHolderName}
              onChange={(e) => setNewBankAccount({...newBankAccount, accountHolderName: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bank Account Number"
              value={newBankAccount.accountNumber}
              onChange={(e) => setNewBankAccount({...newBankAccount, accountNumber: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bank Routing Number"
              value={newBankAccount.routingNumber}
              onChange={(e) => setNewBankAccount({...newBankAccount, routingNumber: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Account Type"
              value={newBankAccount.accountType}
              onChange={(e) => setNewBankAccount({...newBankAccount, accountType: e.target.value as 'checking' | 'savings'})}
              SelectProps={{ native: true }}
            >
              <option value="checking">Checking Account</option>
              <option value="savings">Savings Account</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowAddBankDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddBankAccount}
            sx={{ bgcolor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
          >
            Add Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog 
        open={showDeleteDialog} 
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this bank account? This operation cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteBankAccount}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesSettings; 