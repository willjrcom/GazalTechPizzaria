package proj_vendas.vendas.web.controller;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;

import javax.print.Doc;
import javax.print.DocFlavor;
import javax.print.DocPrintJob;
import javax.print.PrintException;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import javax.print.SimpleDoc;
import javax.print.event.PrintJobAdapter;
import javax.print.event.PrintJobEvent;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import proj_vendas.vendas.model.Pedido;

@Controller
@RequestMapping("/impressora")
public class ImprimirController {
	
	@RequestMapping("/imprimir")
	@ResponseBody
	public void imprimir(@RequestBody Pedido texto) throws URISyntaxException, FileNotFoundException, PrintException, IOException{
		System.out.println("-----------------------------");
		//CRIA A STREAM A PARTIR DA STRING
		InputStream ps = null;
		
		ps = new ByteArrayInputStream(texto.getPizzas().getBytes());
		
		//CRIA O DOCUMENTO DE IMPRESSAO
		DocFlavor flavor = DocFlavor.INPUT_STREAM.AUTOSENSE;
		
		//LOCALIZA AS IMPRESSORAS DISPONIVEIS NO SERVIDOR/PC
		PrintService[] services = PrintServiceLookup.lookupPrintServices(null, null);
		
		//CRIA UM SERVIÇO DE IMPRESSAO, NESTE PONTO A IMPRESSORA AINDA NAO ESTA DEFINIDA
		services = PrintServiceLookup.lookupPrintServices(null, null);
		
		//CRIA UM TRABALHO DE IMPRESSAO
		DocPrintJob job = null;
		for(int i = 0; i<services.length; i++) {
			System.out.println("i: " + i + "-- " + services[i]);
		}
	
        //INSTANCIA O TRABALHO DE IMPRESSAO
        job = services[4].createPrintJob();

        //INSTANCIA O DOCUMENTO
        Doc doc = new SimpleDoc(ps, flavor, null);

        //VERIFICA QUANDO O TRABALHO ESTA COMPLETO
        PrintJobWatcher pjDone = new PrintJobWatcher(job);

        //IMPRIME
        job.print(doc, null);

        //AGUARDA A CONCLUSAO DO TRABALHO
        pjDone.waitForDone();

        ps.close();
		
	}
	
	//Classe para controle de impressões em impressoras matriciais.
	class PrintJobWatcher {
	
		// true iff it is safe to close the print job's input stream
		boolean done = false;
		
		/**
		 * @author Jean C Becker
		 * @version 1.0
		 * Método para verificar o trabalho de impressão em impressoras matriciais.
		 *
		 * @param DocPrintJog   Objeto com o trabalho de impressão.
		 * @return          Não se aplica.
		
		 */
		PrintJobWatcher(DocPrintJob job)
		{
		
		    // Add a listener to the print job
		
		    job.addPrintJobListener(new PrintJobAdapter()
		    {
		
		        public void printJobCanceled(PrintJobEvent pje)
		        {
		            allDone();
		        }
		
		        public void printJobCompleted(PrintJobEvent pje)
		        {
		            allDone();
		        }
		
		        public void printJobFailed(PrintJobEvent pje)
		        {
		            allDone();
		        }
		
		        public void printJobNoMoreEvents(PrintJobEvent pje)
		        {
		            allDone();
		        }
		
		        void allDone() {
		            synchronized (PrintJobWatcher.this)
		            {
		                done = true;
		                PrintJobWatcher.this.notify();
		            }
		        }
		    });
		}
		
		/**
		 * @author Jean C Becker
		 * @version 1.0
		 * Método para aguardar a finalização do trabalho de impressao.
		 * @return          Não se aplica.
		
		 */
		public synchronized void waitForDone()
		{
		    try {
		        while (!done)
		        {
		            wait();
		        }
		    } catch (InterruptedException e){
		    }
		}
	}
	
	@RequestMapping("/imprimir1")
	@ResponseBody
	public void diebold(@RequestBody Pedido texto) {
		
	}
}
