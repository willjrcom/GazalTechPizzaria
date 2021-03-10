package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "PEDIDOTEMP")
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

	private int setor; //1 - pizza / 2 - outros
	
	private int codEmpresa;
	
	private String validade;
}
