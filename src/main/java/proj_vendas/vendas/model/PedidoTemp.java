package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "PEDIDOTEMP", indexes = { 
		@Index(name = "codEmpresa_index", columnList = "codEmpresa"),
		@Index(name = "envio_index", columnList = "envio"),
		@Index(name = "status_index", columnList = "status"),
		@Index(name = "data_index", columnList = "data"),
		@Index(name = "comanda_index", columnList = "comanda")
})
public class PedidoTemp extends AbstractEntity<Long> {

	@Column(nullable=false)
	private Long comanda;
	
	@Column(nullable=false)
	private String nome;

	@Lob
	private String pizzas;
	
	@Column(nullable=false)
	private String status;
	
	@Column(nullable=false)
	private String envio;
	
	@Column(nullable=false)
	private String data;
	
	@Column(nullable = false)
	private int codEmpresa;
	
	@Column(nullable = false)
	private String validade;
}
