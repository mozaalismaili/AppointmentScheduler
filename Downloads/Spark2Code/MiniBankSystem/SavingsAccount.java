
public class SavingsAccount extends BankAccount{
    private double interestRate;

    public SavingsAccount(String accountName, String accountNumber, double balance, double interestRate) {
        super(accountName, accountNumber, balance);
        this.interestRate = interestRate;
    }

    public void applyInterest() {
        double interest = balance * interestRate / 100;
        balance += interest;
        System.out.println("Interest applied:" + interest + ". New Balance:" + balance);
    }
    @Override
    public void showAccountInfo() {
        super.showAccountInfo();
        System.out.println("Interest Rate: " + interestRate + "%");
    }

}
