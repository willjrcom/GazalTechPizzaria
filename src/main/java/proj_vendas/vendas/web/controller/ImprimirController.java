package proj_vendas.vendas.web.controller;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.text.DecimalFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.ImpressaoMatricial;
import proj_vendas.vendas.model.ImpressaoPedido;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Impressoes;

@RestController
@RequestMapping("/imprimir")
public class ImprimirController {
	
	@Autowired
	private Impressoes impressoes;
	
	@Autowired
	private Empresas empresas;
	
	@RequestMapping("/online")
	public String impressaoNetBeans() {//modo online
		List<ImpressaoMatricial> todosIm = impressoes.findAll();
		if(todosIm.size() != 0) {
			ImpressaoMatricial im = todosIm.get(0);
			impressoes.deleteById(im.getId());
			return im.getImpressao();
		}
		return null;
	}
	

	@RequestMapping("/imprimirPedido")
	@ResponseBody
	public void imprimirTudo(@RequestBody ImpressaoPedido pedido) {
		
		DecimalFormat decimal = new DecimalFormat("0.00");
		String impressaoCompleta;
		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) + "\r"
							+ cortaString(pedido.getEnderecoEmpresa()) +          "\r"
							+ "CNPJ: " + pedido.getCnpj() +           "\r"
							+ "----------------------------------------\r"
							+ "            CUPOM NAO FISCAL            \r"
							+ "----------------------------------------\r"
							+ "\t\t" + pedido.getEnvio() +          "\r\r"
							+ "----------- DADOS DO CLIENTE -----------\r"
							+ "Comanda: " + pedido.getComanda() +     "\r"
							+ "Cliente:\r" + cortaString(pedido.getNome()) + "\r";
		
		if(pedido.getEnvio().equals("ENTREGA"))
			impressaoCompleta += "Celular: " + pedido.getCelular() + "\r"
							+ cortaString(pedido.getEndereco()) + "\r"
							+ "Taxa de entrega: \tR$ " + decimal.format(pedido.getTaxa()) + "\r";
					
		impressaoCompleta += "Hora: " + pedido.getHora() + "\tData: " + pedido.getData() + "\r\r"
							+ cortaString(pedido.getTexto1()) + "\r";

		//pizzas------------------------------------------------------------------------------------------
		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "----------------------------------------\r" 
							   + "\t\tPIZZAS\r"
								+ "QTD    PRODUTO         V.UNI    V.TOTAL\r\r";
			
			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += limitaString(pedido.getPizzas()[i].getQtd(), 5) 
									+ "  "
									+ limitaString(pedido.getPizzas()[i].getSabor(), 14)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco())), 7)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco()) 
											/ Float.parseFloat(pedido.getPizzas()[i].getQtd())), 7)
									+ "\r";
				
				if (pedido.getPizzas()[i].getBorda() != "") impressaoCompleta += "Com " + limitaString(pedido.getPizzas()[i].getBorda(), 30) + "\r";
			}
		}

		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "----------------------------------------\r"
								+ "\t\tPRODUTOS\r"
								+ "QTD    PRODUTO         V.UNI    V.TOTAL\r\r";
			
			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += limitaString(pedido.getProdutos()[i].getQtd(), 5)
									+ "  "
									+ limitaString(pedido.getProdutos()[i].getSabor(), 14)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco())), 7)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco()) 
										/ Float.parseFloat(pedido.getProdutos()[i].getQtd())), 7)
									+ "\r";
			}
		}

		impressaoCompleta += "----------------------------------------\r"
							+ "\t\tTOTAL\r";
				
		if(pedido.getEnvio().equals("ENTREGA")) {
			impressaoCompleta += "Total:          \tR$ " + decimal.format(pedido.getTotal()) + "\r"
							   + "Total com taxa: \tR$ " + decimal.format(pedido.getTotal() + pedido.getTaxa()) + "\r"
							   + "Levar:          \tR$ " + decimal.format(pedido.getTroco() - pedido.getTotal() - pedido.getTaxa()) + "\r";
		}else {
			impressaoCompleta += "Total:          \tR$ " + decimal.format(pedido.getTotal()) + "\r"
							   + "Levar:          \tR$ " + decimal.format(pedido.getTroco() - pedido.getTotal()) + "\r";
		}

		if(pedido.getTexto2() != "") impressaoCompleta += "----------------------------------------\r"
														+ "\tHORARIO DE FUNCIONAMENTO\r" 
														+ cortaString(pedido.getTexto2()) + "\r";
		
		if(pedido.getPromocao() != "") impressaoCompleta += "----------------------------------------\r"
														+ "\t\tPROMOCAO\r" 
														+ cortaString(pedido.getPromocao()) + "\r";
		
		if(pedido.getObs() != null) impressaoCompleta += "----------------------------------------\r"
														+ "\t\tOBSERVACAO\r" 
														+ cortaString(pedido.getObs()) + "\r";
		
		imprimirLocal(impressaoCompleta);
	}
	
	@RequestMapping("/imprimirPizza")
	@ResponseBody
	public void imprimirPizza(@RequestBody ImpressaoPedido pedido) {

		String impressaoCompleta;
		
		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) +  "\r"
							+ "----------------------------------------\r"
							+ "\t\t" + pedido.getEnvio() +            "\r"
							+ "Comanda: " + pedido.getComanda() +     "\r"
							+ "Cliente:\r"
							+ cortaString(pedido.getNome()) +         "\r";
		
		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "----------------------------------------\r"
								+ "\t\tPIZZAS\r"
								+ "QTD   PRODUTO\r\r";
			
			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += limitaString(pedido.getPizzas()[i].getQtd(), 4)
									+ "  " 
									+ cortaString(pedido.getPizzas()[i].getSabor()) 
									+ "\r";
				if (pedido.getPizzas()[i].getBorda() != "") impressaoCompleta += "Com " + limitaString(pedido.getPizzas()[i].getBorda(), 30) + "\r";
				if (pedido.getPizzas()[i].getObs() != "") impressaoCompleta += "OBS: " + limitaString(pedido.getPizzas()[i].getObs(), 30) + "\r";
				impressaoCompleta += "\r";
			}
		}
		
		impressaoCompleta += "----------------------------------------\r"
							+ "Hora: " + pedido.getHora() + "\tData: " + pedido.getData() + "\r";

		imprimirLocal(impressaoCompleta);
	}
	
	@RequestMapping("/imprimirProduto")
	@ResponseBody
	public void imprimirProduto(@RequestBody ImpressaoPedido pedido) {

		String impressaoCompleta;
		
		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) +  "\r"
							+ "----------------------------------------\r"
							+ "\t\t" + pedido.getEnvio() +            "\r"
							+ "Comanda: " + pedido.getComanda() +     "\r"
							+ "Cliente:\r"
							+ cortaString(pedido.getNome()) +         "\r";
		
		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "----------------------------------------\r"
								+ "\t\tPRODUTOS\r"
								+ "QTD   PRODUTO\r\r";
			
			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += limitaString(pedido.getProdutos()[i].getQtd(), 4)
									+ "  " 
									+ cortaString(pedido.getProdutos()[i].getSabor()) 
									+ "\r";
				if (pedido.getProdutos()[i].getObs() != "") impressaoCompleta += "OBS: " + limitaString(pedido.getProdutos()[i].getObs(), 30) + "\r";
				impressaoCompleta += "\r";
			}
		}
		
		impressaoCompleta += "----------------------------------------\r"
							+ "Hora: " + pedido.getHora() + "\tData: " + pedido.getData() + "\r";
		
		imprimirLocal(impressaoCompleta);
	}
	
	public void imprimirLocal(String impressaoCompleta) {
		Empresa empresa = empresas.findAll().get(0); //validar modo de impressao
		
		impressaoCompleta = impressaoCompleta
                .replace("ç", "c")
                .replace("á", "a")
                .replace("ã", "a")
                .replace("à", "a")
                .replace("Á", "A")
                .replace("À", "A")
                .replace("ó", "o")
                .replace("õ", "o")
                .replace("ô", "o")
                .replace("ò", "o")
                .replace("é", "e")
                .replace("ê", "e")
                .replace("è", "e")
                .replace("í", "i")
                .replace("ì", "i");
		
		if(empresa.isImpressoraOnline() == false) {
			System.out.println("\n\n\n");
			System.out.println(impressaoCompleta);
			//System.out.println("Modo offline");
			try {
                FileOutputStream fos1 = new FileOutputStream("LPT1");
                // Imprime o texto
                try (PrintStream ps1 = new PrintStream(fos1)) {
                    // Imprime o texto
                    ps1.print(impressaoCompleta + "\r\r\r\r\r\r\r");
                    // Fecha o Stream da impressora
                    ps1.close();
                }
            }catch(FileNotFoundException e) {
                try {
                    FileOutputStream fos2 = new FileOutputStream("LPT2");
                    // Imprime o texto
                    try (PrintStream ps2 = new PrintStream(fos2)) {
                        // Imprime o texto
                        ps2.print(impressaoCompleta + "\r\r\r\r\r\r\r");
                        // Fecha o Stream da impressora
                        ps2.close();
                    }
                }catch(FileNotFoundException e2) {
                	//e2.printStackTrace();
                }
                //e.printStackTrace();
            }
		}else {
			ImpressaoMatricial im = new ImpressaoMatricial();
			im.setImpressao(impressaoCompleta);
			impressoes.save(im);
		}
	}
	
	public String limitaString(String texto, int limite) {
		
		String vazio = "                              ";
		if(texto.length() < limite) texto += vazio;
		return (texto.length() <= limite) ? texto : texto.substring(0, limite);
	}
	
	public String cortaString(String texto) {
		int limite = 40;
		return (texto.length() <= limite) ? texto : texto.substring(0, limite) + "\r" + cortaString(texto.substring(limite));
	}
	
	
	
	
	
	
	
	
	
	
	
	/*
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
	*/
	
	/*
	//Classe para controle de impressões em impressoras matriciais.
	class PrintJobWatcher {
	
		// true iff it is safe to close the print job's input stream
		boolean done = false;
		
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
	*/
	
	/*
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
	*/
	
	/*
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
	*/
}
