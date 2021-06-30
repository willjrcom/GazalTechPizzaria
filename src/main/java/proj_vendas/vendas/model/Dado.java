package proj_vendas.vendas.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "DADO", indexes = { 
		@Index(name = "codEmpresa_index", columnList = "codEmpresa"),
		@Index(name = "data_index", columnList = "data"), 
		@Index(name = "trocoFinal_index", columnList = "trocoFinal")
})
public class Dado extends AbstractEntity<Long> {
		
	@Column(nullable=false)
	private String data;
	
	@Lob
	private String clientes = "";
	
	@Column(nullable = false)
	private float totalVendas = 0;
	
	@Column(nullable = false)
	private float totalLucro = 0;
	
	
	@Column(nullable = false)
	private float trocoInicio = 0;
	
	@Column(nullable = false)
	private float trocoFinal = 0;

	@Column(nullable = false)
	private int comanda = 0;
	
	@Column(nullable = false)
	private int totalPedidos = 0;
	
	@Column(nullable = false)
	private int totalPizza = 0;
	
	@Column(nullable = false)
	private int totalProduto = 0;
	
	@Column(nullable = false)
	private int entrega = 0;
	
	@Column(nullable = false)
	private int balcao = 0;
	
	@Column(nullable = false)
	private int mesa = 0;
	
	@Column(nullable = false)
	private int drive = 0;
	
	
	@Column(nullable = false)
	private float venda_entrega = 0;
	
	@Column(nullable = false)
	private float venda_balcao = 0;
	
	@Column(nullable = false)
	private float venda_mesa = 0;
	
	@Column(nullable = false)
	private float venda_drive = 0;
	
	@Column(nullable = false)
	private float taxa_entrega = 0;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Sangria> sangria;

	@OneToMany(cascade = CascadeType.ALL)
	private List<LogMotoboy> logMotoboy;

	@OneToMany(cascade = CascadeType.ALL)
	private List<Compra> compra;
	
	@Column(nullable=false)
	private int codEmpresa;
}


