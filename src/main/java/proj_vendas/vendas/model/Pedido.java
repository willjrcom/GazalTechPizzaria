package proj_vendas.vendas.model;

import java.io.Serializable;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Entity
@Table(name = "PEDIDOS")
@Service
//@JsonIgnoreProperties(ignoreUnknown=true)
public class Pedido implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long codigoPedido;
	private String nomePedido;
	private String celular;
	private String endereco;

    @JsonProperty("pedidos")
	@Lob
	private Map<String,Object> produto;
	
	//@DateTimeFormat(pattern = "dd/MM/yyyy")
	//private Date data;

	private TipoStatus status;
	private TipoEnvio envio;
	private float total;
	private float troco;
}
