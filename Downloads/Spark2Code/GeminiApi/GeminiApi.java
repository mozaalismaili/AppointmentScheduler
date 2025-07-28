
import java.net.*;
import java.io.*;
import java.util.Scanner;

public class GeminiApi {

    public static void main(String[] args) throws Exception {
        String apiKey = "AIzaSyBk7QxkUSoHL8a3rqToBNALpPmvUcauaXQ";
        String urlStr = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        Scanner userInput = new Scanner(System.in);
        System.out.println("Enter your query (press enter to continue): \n");
        String query = userInput.nextLine();
        String json = "{\"contents\":[{\"parts\":[{\"text\":\"" + query + "\"}]}]}";

        URL url = new URL(urlStr);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);


        OutputStream os = con.getOutputStream();
        os.write(json.getBytes());
        os.close();


        InputStream inputStream = con.getInputStream();
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
        BufferedReader br = new BufferedReader(inputStreamReader);
        String line;
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
        br.close();
    }
}