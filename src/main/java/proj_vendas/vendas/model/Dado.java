package proj_vendas.vendas.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(name = "DADO")
public class Dado extends AbstractEntity<Long> {
		
	@Column(nullable=false)
	private String data;
	
	@Lob
	private String clientes = "";
	
	private float totalVendas = 0;
	private float totalLucro = 0;
	
	private float trocoInicio = 0;
	private float trocoFinal = 0;

	private int comanda = 0;
	
	private int totalPedidos = 0;
	private int totalPizza = 0;
	private int totalProduto = 0;
	
	private int entrega = 0;
	private int balcao = 0;
	private int mesa = 0;
	private int drive = 0;
	
	private float venda_entrega = 0;
	private float venda_balcao = 0;
	private float venda_mesa = 0;
	private float venda_drive = 0;
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


