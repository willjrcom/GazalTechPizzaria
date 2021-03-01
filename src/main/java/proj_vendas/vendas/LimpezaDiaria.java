package proj_vendas.vendas;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.repository.PedidoTemps;

@Service
@Controller
@Component
public class LimpezaDiaria {

	@Autowired
	private PedidoTemps temps;
	
	@Async("fileExecutor")
	public void cleanAllTemps() {
		System.out.println("inicio - pedidos temporarios");
		List<PedidoTemp> pedidos = temps.findAll();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd kk:mm");
		System.out.println("total de pedidos temporarios: " + pedidos.size());
		
		for(int i = 0; i < pedidos.size(); i++) {
			System.out.println(pedidos.get(i).getValidade() + "\n" + format.format(new Date()));
			System.out.println(pedidos.get(i).getValidade().equals(format.format(new Date())));
			if(pedidos.get(i).getValidade().compareTo(format.format(new Date())) < 0) {
				temps.deleteById(pedidos.get(i).getId());
			}
		}
		System.out.println("Fim - pedidos temporarios");
	}
	
}
