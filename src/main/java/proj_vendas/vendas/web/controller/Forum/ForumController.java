package proj_vendas.vendas.web.controller.Forum;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Comentario;
import proj_vendas.vendas.model.Duvida;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Comentarios;
import proj_vendas.vendas.repository.Duvidas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/f")
public class ForumController {

	@Autowired
	private Duvidas duvidas;

	@Autowired
	private Comentarios comentarios;

	@Autowired
	private Usuarios usuarios;

	@GetMapping("/forum")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		List<Duvida> todasDuvidas = user.getDuvida();
		ModelAndView mv = new ModelAndView("forum");

		for (int i = 1; i < 6; i++) {
			mv.addObject("op" + i, 0);
		}

		for (int i = 0; i < todasDuvidas.size(); i++) {
			mv.addObject("op" + todasDuvidas.get(i).getCodigo(), 1);
			mv.addObject("pergunta" + todasDuvidas.get(i).getCodigo(), todasDuvidas.get(i).getDuvida());
			mv.addObject("id" + todasDuvidas.get(i).getCodigo(), todasDuvidas.get(i).getId());
		}
		return mv;
	}

	@RequestMapping("/forum/todasPerguntas")
	@ResponseBody
	public List<Duvida> todasPerguntas() {
		return duvidas.findAll();
	}

	@RequestMapping("/forum/criar")
	@ResponseBody
	public ResponseEntity<Duvida> criar(@RequestBody Duvida duvida) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		List<Duvida> minhasPerguntas = user.getDuvida();
		novaDuvida(-1, duvida, user);

		for (int i = 0; i < minhasPerguntas.size(); i++) {
			if (minhasPerguntas.get(i).getCodigo() == duvida.getCodigo()) {
				Duvida dvSalva = duvidas.findByCodigo(duvida.getCodigo());
				novaDuvida(dvSalva.getId(), duvida, user);
				duvidas.save(duvida);
				return ResponseEntity.ok(duvida);
			}
		}

		// salvar no usuario
		minhasPerguntas.add(duvida);
		user.setDuvida(minhasPerguntas);
		usuarios.save(user);

		return ResponseEntity.ok(duvida);
	}

	@RequestMapping("/forum/userId")
	@ResponseBody
	public long userId() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return user.getId();
	}

	@RequestMapping("/forum/minhasPerguntas")
	@ResponseBody
	public List<Duvida> minhasPerguntas() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return user.getDuvida();
	}

	@RequestMapping("/forum/comentar/{id}")
	@ResponseBody
	public Comentario comentar(@PathVariable long id, @RequestBody String mensagem) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		SimpleDateFormat format = new SimpleDateFormat("kk:mm:ss dd/MM/yyyy");

		Duvida duvida = duvidas.findById(id).get();
		List<Comentario> comentarios = duvida.getComentario();
		Comentario comentario = new Comentario();

		comentario.setResponsavel(user.getNome());
		comentario.setDescricao(mensagem);
		comentario.setData(format.format(new Date()));
		comentario.setDescurtida(new ArrayList<String>());
		comentario.setCurtida(new ArrayList<String>());

		comentarios.add(comentario);

		duvida.setComentario(comentarios);
		duvidas.save(duvida);

		return duvida.getComentario().get(comentarios.size() - 1);
	}

	@RequestMapping("/forum/excluir/{id}")
	@ResponseBody
	public ResponseEntity<?> excluir(@PathVariable long id) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		List<Duvida> todasDuvidas = user.getDuvida();
		
		for (int i = 0; i < todasDuvidas.size(); i++) {
			if (todasDuvidas.get(i).getId() == id) {
				todasDuvidas.remove(i);
				user.setDuvida(todasDuvidas);
				usuarios.save(user);
				duvidas.deleteById(id);
				return ResponseEntity.ok(200);
			}
		}
		return ResponseEntity.noContent().build();
	}

	@RequestMapping("/forum/curtir/{op}/{userId}/{id}")
	@ResponseBody
	public ResponseEntity<?> curtir(@PathVariable int op, @PathVariable String userId, @PathVariable long id) {
		// 1 curtir pergunta
		// 2 descurtir pergunta
		// 3 curtir comentario
		// 4 descurtir comentario

		if (op == 1 || op == 2) {
			Duvida duvida = duvidas.findById(id).get();
			if (op == 1) {
				ArrayList<String> curtida = duvida.getCurtida();
				curtida.add(userId);
				duvida.setCurtida(curtida);

			} else if (op == 2) {
				ArrayList<String> descurtida = duvida.getDescurtida();
				descurtida.add(userId);
				duvida.setDescurtida(descurtida);
			}
			duvidas.save(duvida);
		}
		if (op == 3 || op == 4) {
			Comentario comentario = comentarios.findById(id).get();
			if (op == 3) {
				ArrayList<String> curtida = comentario.getCurtida();
				curtida.add(userId);
				comentario.setCurtida(curtida);
			} else if (op == 4) {
				ArrayList<String> descurtida = comentario.getDescurtida();
				descurtida.add(userId);
				comentario.setDescurtida(descurtida);
			}
			comentarios.save(comentario);
		}
		return ResponseEntity.noContent().build();
	}

	@RequestMapping("/forum/rmCurtir/{op}/{userId}/{id}")
	@ResponseBody
	public ResponseEntity<?> rmCurtir(@PathVariable int op, @PathVariable String userId, @PathVariable long id) {
		// 1 curtir pergunta
		// 2 descurtir pergunta
		// 3 curtir comentario
		// 4 descurtir comentario

		if (op == 1 || op == 2) {
			Duvida duvida = duvidas.findById(id).get();
			if (op == 1) {
				ArrayList<String> curtida = duvida.getCurtida();
				for (int i = 0; i < curtida.size(); i++) {
					if(curtida.get(i).equals(userId)) {
						curtida.remove(i);
					}
				}
				duvida.setCurtida(curtida);

			} else if (op == 2) {
				ArrayList<String> descurtida = duvida.getDescurtida();
				for (int i = 0; i < descurtida.size(); i++) {
					if(descurtida.get(i).equals(userId)) {
						descurtida.remove(i);
					}
				}
				duvida.setDescurtida(descurtida);
			}
			duvidas.save(duvida);
		}
		if (op == 3 || op == 4) {
			Comentario comentario = comentarios.findById(id).get();
			if (op == 3) {
				ArrayList<String> curtida = comentario.getCurtida();
				for (int i = 0; i < curtida.size(); i++) {
					if(curtida.get(i).equals(userId)) {
						curtida.remove(i);
					}
				}
				comentario.setCurtida(curtida);
			} else if (op == 4) {
				ArrayList<String> descurtida = comentario.getDescurtida();
				for (int i = 0; i < descurtida.size(); i++) {
					if(descurtida.get(i).equals(userId)) {
						descurtida.remove(i);
					}
				}
				comentario.setDescurtida(descurtida);
			}
			comentarios.save(comentario);
		}
		return ResponseEntity.noContent().build();
	}

	private Duvida novaDuvida(long id, Duvida duvida, Usuario user) {
		// validade
		SimpleDateFormat format = new SimpleDateFormat("kk:mm:ss dd/MM/yyyy");
		SimpleDateFormat data = new SimpleDateFormat("yyyy-");
		SimpleDateFormat mesString = new SimpleDateFormat("MM");
		SimpleDateFormat dia = new SimpleDateFormat("-dd");

		if (id != -1)
			duvida.setId(id);
		duvida.setNome(user.getNome());
		duvida.setConcluido(false);
		duvida.setData(format.format(new Date()));
		duvida.setCurtida(new ArrayList<String>());
		duvida.setDescurtida(new ArrayList<String>());

		int mesInt = Integer.parseInt(mesString.format(new Date()));

		// permite 1 mes
		mesInt += 1;

		if (mesInt < 10)
			duvida.setValidade(data.format(new Date()) + "0" + mesInt + dia.format(new Date()));
		else
			duvida.setValidade(data.format(new Date()) + mesInt + dia.format(new Date()));

		return duvida;
	}
}
