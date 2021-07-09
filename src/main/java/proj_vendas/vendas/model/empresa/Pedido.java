package proj_vendas.vendas.model.empresa;

import java.util.List;

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
@Table(name = "PEDIDO", indexes = { 
		@Index(name = "codEmpresa_index", columnList = "codEmpresa"),
		@Index(name = "data_index", columnList = "data"),
		@Index(name = "status_index", columnList = "status"),
		@Index(name = "nome_index", columnList = "nome"),
		@Index(name = "envio_index", columnList = "envio"),
		@Index(name = "celular_index", columnList = "celular"),
})
public class Pedido extends AbstractEntity<Long> {

	@Column(nullable=false)
	private Long codEmpresa;

	
	// Cliente
	@Column
	private Long celular;
	
	@Column(nullable=false)
	private String nome;

	@Column
	private String endereco;

	@Column
	private String referencia;
	
	
	// Pedido
	@Column(nullable=false)
	private Long comanda;
	
	@Lob
	private List<String> produtos;

	@Column
	private String obs;
	
	@Column
	private String motoboy;

	@Column
	private String ac;

	@Column
	private String garcon;
	
	@Column(nullable=false)
	private String status;
	
	@Column(nullable=false)
	private String envio;
	
	@Column(nullable = false)
	private String horaPedido;
	
	@Column(nullable = false)
	private String data;

	@Column
	private String cupom;
	
	@Column(nullable = false)
	private String modoPagamento;

	@Column
	private boolean pago = true;

	@Column
	private float taxa = 0;

	@Column
	private float total = 0;

	@Column
	private float troco = 0;

	@Column
	private float servico = 0;
	
	@Column(nullable = false)
	private String validade;
}
