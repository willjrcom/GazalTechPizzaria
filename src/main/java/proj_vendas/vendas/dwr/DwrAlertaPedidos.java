package proj_vendas.vendas.dwr;

import java.util.Calendar;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import org.directwebremoting.Browser;
import org.directwebremoting.ScriptSessions;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.repository.PedidoTemps;

@Component
@RemoteProxy
public class DwrAlertaPedidos {
	
	@Autowired
	private PedidoTemps temps;
	
	@RemoteMethod
	public synchronized void init() {
		System.out.println("Dwr ativado");
		List<PedidoTemp> pedidos = temps.findByStatus("COZINHA"); //mostrar todos temporarios
		WebContext context = WebContextFactory.get();
		Timer timer = new Timer();
		timer.scheduleAtFixedRate(new AlertTask(context, pedidos), 0, 30000);
	}
	
	class AlertTask extends TimerTask {
		private long count;
		private WebContext context;
		private List<PedidoTemp> pedidos;
		
		public AlertTask(WebContext context, List<PedidoTemp> pedidos) {
			super();
			this.setPedidos(pedidos);
			this.context = context;
		}
		
		@Override
		public void run() {
			String session = context.getScriptSession().getId();
			Browser.withSession(context, session, new Runnable() {

				@Override
				public void run() {
					List<PedidoTemp> pedidos = temps.findByStatus("COZINHA"); //mostrar todos temporarios
					count = pedidos.size();
					
					Calendar time = Calendar.getInstance();
					time.setTimeInMillis(context.getScriptSession().getLastAccessedTime());
					System.out.println("count: " + count
									+ "\nsessao: " + session
									+ "ntempo: " + time.getTime());
					if(count > 0) {
						ScriptSessions.addFunctionCall("showButton", count);
					}
				}
			});
		}

		public List<PedidoTemp> getPedidos() {
			return pedidos;
		}

		public void setPedidos(List<PedidoTemp> pedidos) {
			this.pedidos = pedidos;
		}
	}
}
