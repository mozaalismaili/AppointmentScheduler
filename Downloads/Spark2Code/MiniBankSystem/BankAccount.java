public class BankAccount {
    private String accountName;
    private String accountNumber;
    protected double balance;
    //Add a constructor
    public BankAccount(String accountName, String accountNumber, double balance) {
        this.accountName = accountName;
        this.accountNumber = accountNumber;
        this.balance = balance;
    }
    public String getAccountName() { return accountName; }
    public String getAccountNumber() { return accountNumber; }

    public void showAccountInfo(){
        System.out.println("Account Name:"+" "+accountName);
        System.out.println("Account Number"+" "+accountNumber);
        System.out.println("Balance"+" "+balance);
    }
    public void Deposit(double amount){
        balance += amount;
        System.out.println("Your account balance:"+" "+balance);
    }
    public void Withdraw(double amount){
       if (amount>balance){
           System.out.println("non-sufficient funds");       }
       else{
           balance -= amount;
           System.out.println("Your account balance:"+" "+balance);
       }
    }

}
