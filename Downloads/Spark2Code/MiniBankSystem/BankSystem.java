public class BankSystem {
    public static void main(String[] args){
        BankAccount acount1 = new BankAccount("Reem", "11111111", 2000.0);
        BankAccount acount2 = new BankAccount("Sara", "22222222", 1200.0);
        acount1.showAccountInfo();
        acount2.showAccountInfo();
        DisplayMenu();



    }
    public static void DisplayMenu(){

        System.out.println("Option 1: Create a new account");
        System.out.println("Option 2: Deposit money");
        System.out.println("Option 3: Withdraw money");
        System.out.println("Option 4: View account details");
        System.out.println("Option 5: Exit");
    }

}
