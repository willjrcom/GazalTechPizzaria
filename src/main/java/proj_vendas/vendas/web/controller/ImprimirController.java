package proj_vendas.vendas.web.controller;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.List;

import javax.print.Doc;
import javax.print.DocFlavor;
import javax.print.DocPrintJob;
import javax.print.PrintException;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import javax.print.SimpleDoc;
import javax.print.event.PrintJobAdapter;
import javax.print.event.PrintJobEvent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import proj_vendas.vendas.model.ImpressaoMatricial;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.repository.Impressoes;

@RestController
@RequestMapping("/imprimir")
public class ImprimirController {
	
	@Autowired
	private Impressoes impressoes;
	
	@RequestMapping
	public String impressaoNetBeans() {
		List<ImpressaoMatricial> todosIm = impressoes.findAll();
		ImpressaoMatricial im = todosIm.get(0);
		impressoes.deleteById(im.getId());
		return im.getImpressao();
	}
	
	
	@RequestMapping("/imprimir")
	@ResponseBody
	public void imprimir(@RequestBody Pedido texto) throws URISyntaxException, FileNotFoundException, PrintException, IOException{

		try {
			//CRIA O DOCUMENTO DE IMPRESSAO
			DocFlavor flavor = DocFlavor.INPUT_STREAM.AUTOSENSE;
	
			//CRIA A STREAM A PARTIR DA STRING
			InputStream stream = new ByteArrayInputStream(texto.getPizzas().getBytes());
			
			//LOCALIZA AS IMPRESSORAS DISPONIVEIS NO SERVIDOR/PC
			PrintService impressora = PrintServiceLookup.lookupDefaultPrintService();
			
			//CRIA E INSTANCIA UM TRABALHO DE IMPRESSAO
			DocPrintJob job = impressora.createPrintJob();
			
	        //INSTANCIA O DOCUMENTO
	        Doc doc = new SimpleDoc(stream, flavor, null);
	
	        //VERIFICA QUANDO O TRABALHO ESTA COMPLETO
	        PrintJobWatcher pjDone = new PrintJobWatcher(job);
	
	        //IMPRIME
	        job.print(doc, null);
	
	        //AGUARDA A CONCLUSAO DO TRABALHO
	        pjDone.waitForDone();
	
	        stream.close();
	        
		}catch (Exception e){
			e.printStackTrace();
		}
		
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
	

	private static PrintService impressora;
	
	@RequestMapping("/imprimir1")
	@ResponseBody
	public void diebold(@RequestBody Pedido texto) {
		try{
			// Pega a impressora padrão
			impressora = PrintServiceLookup.lookupDefaultPrintService();
		
			// Definição de atributos do conteúdo a ser impresso:
			DocFlavor flavor = DocFlavor.INPUT_STREAM.AUTOSENSE;
		
			// Conteúdo a ser impresso
			InputStream stream = new ByteArrayInputStream((texto.getPizzas() + "\u039A" + "END").getBytes());  
		
			// Cria um Doc para impressão a partir do arquivo exemplo.txt   
			Doc documentoTexto = new SimpleDoc(stream, flavor, null);
		
			// Cria uma tarefa de impressão
			DocPrintJob dpj = impressora.createPrintJob();
		
			// 	Imprime o documento sem exibir uma tela de dialogo
			dpj.print(documentoTexto, null);
			
			
		} catch (Exception e){
			e.printStackTrace();
		}
	}
	
	
	@RequestMapping("/imprimir2")
	@ResponseBody
	public void imprimir2(@RequestBody Pedido texto) {
		String texto1 = "Algo a ser impresso, use caracteres de formatação relativos ao modelo da impressora";

		PrintService[] services = PrintServiceLookup.lookupPrintServices(null, null);
		//lista todas as impressoras instaladas
		for (int i = 0; i < services.length; i++) {
		System.out.println(services[i].getName());
		}
		try {
		PrintService impressora=services[0]; //escolhi a 3. impressora listada

		DocPrintJob dpj = impressora.createPrintJob();
		InputStream stream = new ByteArrayInputStream(texto1.getBytes());

		DocFlavor flavor = DocFlavor.INPUT_STREAM.AUTOSENSE;
		Doc doc = new SimpleDoc(stream, flavor, null);
		dpj.print(doc, null);

		} catch (PrintException e) {
			e.printStackTrace();
		}

		
	}
}
