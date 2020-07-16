package proj_vendas.vendas.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.stereotype.Service;

import lombok.Data;

@Data
@Entity
@Table(name = "PEDIDOS")
@Service
public class Pedido {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long codigoPedido;
	private String nomePedido;
	private String codProduto;
	
	@OneToOne
	private Cliente cliente;
	
	@OneToMany
	private List<Produto> produtos;
	
	//@DateTimeFormat(pattern = "dd/MM/yyyy")
	//private Date data;
	
	private float total;
	private float troco;

	//private static List<Produto> produtos = new ArrayList<>();
}
