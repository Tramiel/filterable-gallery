(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.custom-gallery');
    if (!galleryContainer) {
      console.warn('Conteneur .custom-gallery non trouvé');
      return;
    }

    const isInIframe = window.self !== window.top;
    const targetDocument = isInIframe ? window.parent.document : document;
    const targetBody = targetDocument.body;
    const localDocument = document;

    // Liste des images avec captions et title pour la lightbox et le hover
    const images = [
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/sondages-mission-g2-toulouse-mePgjwjrJDi3nPb8.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/sondages-mission-g2-toulouse-mePgjwjrJDi3nPb8.webp',
        alt: 'Sondage mission G2 à Toulouse ∣ Géosols Études',
        title: 'Sondage mission G2 à Toulouse ∣ Géosols Études',
        caption: 'TOULOUSE (31) - sondage pressiométrique - résidence étudiante - mission G2',
        category: 'sondages'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/sondages-mission-g2-lavaur-tarn-mnl40G0rb2Cp7E5g.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/sondages-mission-g2-lavaur-tarn-mnl40G0rb2Cp7E5g.webp',
        alt: 'Sondage mission G2 à Lavaur ∣ Tarn',
        title: 'Sondage mission G2 à Lavaur ∣ Tarn',
        caption: 'LAVAUR (81) - sondage pénétrométrique - extension ALSH et maison',
        category: 'sondages'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/sondages-mission-g2-lavaur-mP43G1G0MBsZXxzm.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/sondages-mission-g2-lavaur-mP43G1G0MBsZXxzm.webp',
        alt: 'Sondage ∣ Mission G2 ∣ Lavaur ∣ Géosols Études',
        title: 'Sondage ∣ Mission G2 ∣ Lavaur ∣ Géosols Études',
        caption: 'LAVAUR (81) - sondage pressiométrique - escalier de la cathédrale - mission G2',
        category: 'sondages'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/expertise-argiles-secheresse-millau-AMqD5Z5yZQtyJZvQ.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/expertise-argiles-secheresse-millau-AMqD5Z5yZQtyJZvQ.webp',
        alt: 'Mission d\'expertise des argiles suite à la sécheresse à Millau ∣ Geosols Études',
        title: 'Mission d\'expertise des argiles suite à la sécheresse à Millau ∣ Geosols Études',
        caption: 'MILLAU (12) - sondage pressiométrique expertise - mission G5',
        category: 'sondages'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/sondages-etude-sols-fondations-g2pro-graulhet-YNqMn3n4bqFJV38G.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/sondages-etude-sols-fondations-g2pro-graulhet-YNqMn3n4bqFJV38G.webp',
        alt: 'Étude des sols pour sondage ∣ Mission G2pro ∣ Graulhet',
        title: 'Étude des sols pour sondage ∣ Mission G2pro ∣ Graulhet',
        caption: 'GRAULHET (81) - sondages pressiométriques et pénétrométriques  - maison individuelle - mission G2',
        category: 'sondages'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude_sol-assainissement-AoPJOz09qLSBblND.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude_sol-assainissement-AoPJOz09qLSBblND.webp',
        alt: 'Étude de sols assainissement ∣ Tarn Lavaur',
        title: 'Étude de sols assainissement ∣ Tarn Lavaur',
        caption: 'PALLEVILLE (31) - assainissement autonome',
        category: 'assainissement'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sol_assainissement-non-collectif-AQEZ5G0lyLfp9XDV.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sol_assainissement-non-collectif-AQEZ5G0lyLfp9XDV.webp',
        alt: 'Étude de sols assainissement non collectif ∣ Tarn',
        title: 'Étude de sols assainissement non collectif ∣ Tarn',
        caption: 'LAVAUR (81) - assainissement autonome',
        category: 'assainissement'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sol_assainissement-mxBXq03PZOSroP2z.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sol_assainissement-mxBXq03PZOSroP2z.webp',
        alt: 'Étude de sols assainissement ∣ Lavaur',
        title: 'Étude de sols assainissement ∣ Lavaur',
        caption: 'LAVAUR (81) - assainissement autonome - micro station',
        category: 'assainissement'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-de-sol-assainissement-individuel-YKblB20R65IDn9Rn.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-de-sol-assainissement-individuel-YKblB20R65IDn9Rn.webp',
        alt: 'Étude de sols assainissement Individuel ∣ Tarn',
        title: 'Étude de sols assainissement Individuel ∣ Tarn',
        caption: 'LAVAUR (81) - assainissement autonome - micro station',
        category: 'assainissement'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/micro-station-assainissement-spanc-tarn-m7VDNGN1vxIx9yj3.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/micro-station-assainissement-spanc-tarn-m7VDNGN1vxIx9yj3.webp',
        alt: 'Étude de sols micro station : Assainissement ∣ Tarn',
        title: 'Étude de sols micro station : Assainissement ∣ Tarn',
        caption: 'LAVAUR (81) - assainissement autonome - micro station',
        category: 'assainissement'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g1-loi-elan-vente-terrain-geotechnique-tarn-et-garonne-mv0Jv9XqrySz3Pj6.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g1-loi-elan-vente-terrain-geotechnique-tarn-et-garonne-mv0Jv9XqrySz3Pj6.webp',
        alt: 'Loi ELAN - Étude de sols géotechnique G1 dans le Tarn et Garonne ∣ Suite à la vente d\'un terrain',
        title: 'Loi ELAN - Étude de sols géotechnique G1 dans le Tarn et Garonne ∣ Suite à la vente d\'un terrain',
        caption: 'CAMPSAS (82) - mission G1PGC - loi ELAN',
        category: 'elan'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g1-loi-elan-vente-terrain-geotechnique-tarn-Y4Lvq3g7WgSyxbLg.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g1-loi-elan-vente-terrain-geotechnique-tarn-Y4Lvq3g7WgSyxbLg.webp',
        alt: 'Étude de sols G1 - Loi ELAN - Vente d\'un terrain - Étude Géotechnique dans le Tarn',
        title: 'Étude de sols G1 - Loi ELAN - Vente d\'un terrain - Étude Géotechnique dans le Tarn',
        caption: 'HAUTE GARONNE - mission G1PGC - loi ELAN',
        category: 'elan'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-YanJ43aNEDSl7z7e.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g1-loi-elan-vente-terrain-geotechnique-haute-garonne-YanJ43aNEDSl7z7e.webp',
        alt: 'Étude de sols G1 Loi ELAN - Géotechnique en Haute Garonne suite à la vente d\'un terrain',
        title: 'Étude de sols G1 Loi ELAN - Géotechnique en Haute Garonne suite à la vente d\'un terrain',
        caption: 'TARN - mission G1PGC - loi ELAN',
        category: 'elan'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g1-loi-elan-vente-terrain-geotechnique-aveyron-mePJ80a9qESOK7Lp.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g1-loi-elan-vente-terrain-geotechnique-aveyron-mePJ80a9qESOK7Lp.webp',
        alt: 'Géotechnique - Étude de sols G1 Loi ELAN suite à la vente d\'un terrain',
        title: 'Géotechnique - Étude de sols G1 Loi ELAN suite à la vente d\'un terrain',
        caption: 'REQUISTA (12) - mission G1PGC - loi ELAN',
        category: 'elan'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-secheresse-haute-garonne-YanJ43nNnPF3oDr8.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-secheresse-haute-garonne-YanJ43nNnPF3oDr8.webp',
        alt: 'Étude de sols pour expertise G5 suite à un sinistre sécheresse en Haute Garonne',
        title: 'Étude de sols pour expertise G5 suite à un sinistre sécheresse en Haute Garonne',
        caption: 'St RUSTICE (31) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-tarn-Yyv0NqvwLoIEvBRZ.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-tarn-Yyv0NqvwLoIEvBRZ.webp',
        alt: 'Étude de sols G5 expertise sinistre argiles sécheresse dans le Tarn',
        title: 'Étude de sols G5 expertise sinistre argiles sécheresse dans le Tarn',
        caption: 'GRATENTOUR (31) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-saix-tarn-Yyv0NqvwLOCBEVMk.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-saix-tarn-Yyv0NqvwLOCBEVMk.webp',
        alt: 'Etude de sols G5 expertise sinistre argiles sècheresse à Saix dans le Tarn',
        title: 'Etude de sols G5 expertise sinistre argiles sècheresse à Saix dans le Tarn',
        caption: 'SAÏX (81) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-lot-garonne-dJob18ov03TGRlbq.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-lot-garonne-dJob18ov03TGRlbq.webp',
        alt: 'Étude de sols G5 expertise sinistre argiles sécheresse dans le Lot et Garonne',
        title: 'Étude de sols G5 expertise sinistre argiles sécheresse dans le Lot et Garonne',
        caption: 'TAYRAC (47) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-haute_garonne-YD0w2a03goCnogej.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-haute_garonne-YD0w2a03goCnogej.webp',
        alt: 'Étude sols G5 expertise sinistre argile sécheresse en Haute Garonne',
        title: 'Étude sols G5 expertise sinistre argile sécheresse en Haute Garonne',
        caption: 'St RUSTICE (31) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-gaillac-tarn-mv0Jv90qQBHzPD05.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-gaillac-tarn-mv0Jv90qQBHzPD05.webp',
        alt: 'Expertise G5 étude de sols sinistre argiles sécheresse à Gaillac dans le Tarn',
        title: 'Expertise G5 étude de sols sinistre argiles sécheresse à Gaillac dans le Tarn',
        caption: 'GAILLAC (81) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-castres-tarn-m2WEvMWLPphye92O.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-castres-tarn-m2WEvMWLPphye92O.webp',
        alt: 'Expertise G5 - Étude de sols - Sinistre argiles sécheresse à Castres dans le Tarn',
        title: 'Expertise G5 - Étude de sols - Sinistre argiles sécheresse à Castres dans le Tarn',
        caption: 'CASTRES (81) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-castelginest-haute-garonne-dOqDL3qQEQsja1J6.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-castelginest-haute-garonne-dOqDL3qQEQsja1J6.webp',
        alt: 'Expertise G5 - Étude de sols suite sinistre argiles et sécheresse à Castelginest en Haute Garonne',
        title: 'Expertise G5 - Étude de sols suite sinistre argiles et sécheresse à Castelginest en Haute Garonne',
        caption: 'CASTELGINEST (31) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-argiles-secheresse-haute-garonne-m6Lb6oLNxGFgPQ18.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-argiles-secheresse-haute-garonne-m6Lb6oLNxGFgPQ18.webp',
        alt: 'Expertise G5 argiles sécheresse en Haute Garonne - Étude de sols',
        title: 'Expertise G5 argiles sécheresse en Haute Garonne - Étude de sols',
        caption: 'St RUSTICE (31) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-expertise-sinistre-argiles-secheresse-g5-tarn-YleQ1zePkot3WWgR.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-expertise-sinistre-argiles-secheresse-g5-tarn-YleQ1zePkot3WWgR.webp',
        alt: 'Expertise G5 pour sinistre argiles suite sécheresse dans le Tarn',
        title: 'Expertise G5 pour sinistre argiles suite sécheresse dans le Tarn',
        caption: 'CASTRES (81) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-AQEZ5GEKGytbNnX3.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-expertise-sinistre-argiles-secheresse-g5-haute-garonne-AQEZ5GEKGytbNnX3.webp',
        alt: 'Expertise G5 en Haute Garonne - Étude de sols suite sinistre argiles et sécheresse',
        title: 'Expertise G5 en Haute Garonne - Étude de sols suite sinistre argiles et sécheresse',
        caption: 'MONTJOIRE (31) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-expertise-g5-sinistre-argiles-secheresse-haute-garonne-mp8Jxz81zKFDgDpe.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-expertise-g5-sinistre-argiles-secheresse-haute-garonne-mp8Jxz81zKFDgDpe.webp',
        alt: 'Étude de sols - Expertise G5 - Haute Garonne - Sinistre argiles suite à la sécheresse',
        title: 'Étude de sols - Expertise G5 - Haute Garonne - Sinistre argiles suite à la sécheresse',
        caption: 'BOULOC (31) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-haute-garonne-Yg2yNa220kS9K3QG.jpg',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g5-expertise-sinistre-argiles-secheresse-haute-garonne-Yg2yNa220kS9K3QG.jpg',
        alt: 'Étude de sols G5 expertise - Sinistre du sol argiles suite à sécheresse',
        title: 'Étude de sols G5 expertise - Sinistre du sol argiles suite à sécheresse',
        caption: 'GRATENTOUR (31) - expertise - mission G5',
        category: 'expertises'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-voiries-lavaur-tarn-Yan0Gw6VNBSZyM7k.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-voiries-lavaur-tarn-Yan0Gw6VNBSZyM7k.webp',
        alt: 'Étude des sols G2 ∣ Voirie à Lavaur ∣ Tarn',
        title: 'Étude des sols G2 ∣ Voirie à Lavaur ∣ Tarn',
        caption: 'LAVAUR (81) - voiries (av. Aymeric de Montréal) mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-rehabilitation-ancienne-gare-st-juery-tarn-A3Qlx1ak0DcjqRkE.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-rehabilitation-ancienne-gare-st-juery-tarn-A3Qlx1ak0DcjqRkE.webp',
        alt: 'Étude des sols G2 de réhabilitation ∣ Ancienne Gare de St Juery ∣ Tarn',
        title: 'Étude des sols G2 de réhabilitation ∣ Ancienne Gare de St Juery ∣ Tarn',
        caption: 'St JUERY (81) - réhabilitation de l\'ancienne gare - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-AE079w2KBLuLkDV8.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-restaurant-scolaire-le-sequestre-tarn-AE079w2KBLuLkDV8.webp',
        alt: 'Étude des sols mission G2 pour les fondations d\'une restaurant scolaire ∣ Le Séquestre ∣ Tarn',
        title: 'Étude des sols mission G2 pour les fondations d\'une restaurant scolaire ∣ Le Séquestre ∣ Tarn',
        caption: 'LE  SEQUESTRE (81) - cantine scolaire - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-rehabilitation-batiment-castres-tarn-1-mp84OL3Va5FpGGRz.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-rehabilitation-batiment-castres-tarn-1-mp84OL3Va5FpGGRz.webp',
        alt: 'Étude des sols G2 ∣ Fondations pour la réhabilitation d\'un batiment à Castres ∣ Tarn',
        title: 'Étude des sols G2 ∣ Fondations pour la réhabilitation d\'un batiment à Castres ∣ Tarn',
        caption: 'CASTRES (81) - réhabilitation bâtiment - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-pharmacie-lavaur-tarn-A3Qlx1ak5afVNa6N.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-pharmacie-lavaur-tarn-A3Qlx1ak5afVNa6N.webp',
        alt: 'Étude des sols ∣ Mission G2 pour les fondations d\'une pharmacie à Lavaur ∣ Tarn',
        title: 'Étude des sols ∣ Mission G2 pour les fondations d\'une pharmacie à Lavaur ∣ Tarn',
        caption: 'LAVAUR (81) - pharmacie - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-musees-des-archives-lavaur-tarn-mp84OL3V15uwrZej.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-musees-des-archives-lavaur-tarn-mp84OL3V15uwrZej.webp',
        alt: 'Étude sols G2 ∣ Fondation du musé des archives ∣ Lavaur ∣ Tarn',
        title: 'Étude sols G2 ∣ Fondation du musé des archives ∣ Lavaur ∣ Tarn',
        caption: 'LAVAUR (81) - réserves du musée - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-moulin-prieres-marzens-tarn-m2WqyeBzO3U5glb6.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-moulin-prieres-marzens-tarn-m2WqyeBzO3U5glb6.webp',
        alt: 'Étude de sols ∣ G2 ∣ Fondation d\'un moulin de prière ∣ Marzens ∣ Tarn',
        title: 'Étude de sols ∣ G2 ∣ Fondation d\'un moulin de prière ∣ Marzens ∣ Tarn',
        caption: 'MARZENS (81) - moulin à prières institut Bouddhiste - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-maison-massac-seran-tarn-AzGMvWjpvkho8K7y.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-maison-massac-seran-tarn-AzGMvWjpvkho8K7y.webp',
        alt: 'Étude de sols G2 ∣ Fondation d\'une maison ∣ Massac Seran ∣ Tarn',
        title: 'Étude de sols G2 ∣ Fondation d\'une maison ∣ Massac Seran ∣ Tarn',
        caption: 'LAVAUR (81) - maison individuelle - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-maison-individuelle-lavaur-tarn-A1az631vkoIE1aqB.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-maison-individuelle-lavaur-tarn-A1az631vkoIE1aqB.webp',
        alt: 'Étude de sols G2 ∣ Étude des fondations d\'une maison individuelle ∣ Lavaur ∣ Tarn',
        title: 'Étude de sols G2 ∣ Étude des fondations d\'une maison individuelle ∣ Lavaur ∣ Tarn',
        caption: 'LAVAUR (81) - maison individuelle - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-maison-du-campus-castres-tarn-AQEeza870JI8NQWR.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-maison-du-campus-castres-tarn-AQEeza870JI8NQWR.webp',
        alt: 'Étude des sols G2 ∣ Fondations d\'une maison de campus ∣ Castres ∣ Tarn',
        title: 'Étude des sols G2 ∣ Fondations d\'une maison de campus ∣ Castres ∣ Tarn',
        caption: 'CASTRES (81) - maison de campus - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-extension-maison-massac-seran-tarn-1-mv0Paz5poEHMOXJ6.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-extension-maison-massac-seran-tarn-1-mv0Paz5poEHMOXJ6.webp',
        alt: 'Étude des sols G2 ∣ Fondations d\'une extension de maison à Massac Seran ∣ Tarn',
        title: 'Étude des sols G2 ∣ Fondations d\'une extension de maison à Massac Seran ∣ Tarn',
        caption: 'LAVAUR (81) - extension - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-extension-maison-massac-seran-mp84OL3p0XIbBGZ0.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-extension-maison-massac-seran-mp84OL3p0XIbBGZ0.webp',
        alt: 'Étude de sols G2 ∣ Fondations ∣ Extension d\'une maison à Massac Seran',
        title: 'Étude de sols G2 ∣ Fondations ∣ Extension d\'une maison à Massac Seran',
        caption: 'LAVAUR (81) - extension - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-extension-batiment-industriel-lagrave-tarn-AGBz1PMeBBh73lxx.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-extension-batiment-industriel-lagrave-tarn-AGBz1PMeBBh73lxx.webp',
        alt: 'Étude de sols G2 ∣ Fondations d\'une extension d\'un batiment industriel à Lagrave dans le Tarn',
        title: 'Étude de sols G2 ∣ Fondations d\'une extension d\'un batiment industriel à Lagrave dans le Tarn',
        caption: 'LAGRAVE (81) - extension bâtiment industriel - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-ecole-lavaur-tarn-AGBz1PMeBEhqvQJB.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-ecole-lavaur-tarn-AGBz1PMeBEhqvQJB.webp',
        alt: 'Étude de sol G2 pour une école à lavaur dans le Tarn ∣ Fondations',
        title: 'Étude de sol G2 pour une école à lavaur dans le Tarn ∣ Fondations',
        caption: 'LAVAUR (81) - école Comtesse de Ségur - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-bureaux-castres-tarn-mxB2GNjp9Rc7bVe8.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-bureaux-castres-tarn-mxB2GNjp9Rc7bVe8.webp',
        alt: 'Étude de sols G2 pour les fondations à Castres dans le Tarn de Bureaux',
        title: 'Étude de sols G2 pour les fondations à Castres dans le Tarn de Bureaux',
        caption: 'CASTRES (81) - bureaux - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-bureaux-castres-dWxLqEeWVbhrx2RO.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-bureaux-castres-dWxLqEeWVbhrx2RO.webp',
        alt: 'Étude de sols G2 ∣ Fondations de bureaux à Castres ∣ Géosols Études',
        title: 'Étude de sols G2 ∣ Fondations de bureaux à Castres ∣ Géosols Études',
        caption: 'CASTRES (81) - bureaux - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-boualngerie-graulhet-tarn-AoP47xZpQvHzKz3q.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-boualngerie-graulhet-tarn-AoP47xZpQvHzKz3q.webp',
        alt: 'Étude de sols G2 pour les fondations de la boulangerie ANGE à Graulhet dans le Tarn',
        title: 'Étude de sols G2 pour les fondations de la boulangerie ANGE à Graulhet dans le Tarn',
        caption: 'GRAULHET (81) - boulangerie - mission G2',
        category: 'references'
      },
      {
        src: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-batiment-industriel-lavaur-tarn-d95ZOjDwoEtrQOvJ.webp',
        fullSrc: 'https://assets.zyrosite.com/AR03lgPkMzsDyQxv/etude-sols-g2-fondations-batiment-industriel-lavaur-tarn-d95ZOjDwoEtrQOvJ.webp',
        alt: 'Étude de sols G2 pour les fondations d\'un batiment industriel à Lavaur dans le Tarn',
        title: 'Étude de sols G2 pour les fondations d\'un batiment industriel à Lavaur dans le Tarn',
        caption: 'LAVAUR (81) - bureaux / dépôt - mission G2',
        category: 'references'
      }
    ];

    // Générer le HTML de la galerie avec caption au hover et title
    galleryContainer.innerHTML = `
      <div class="filter-buttons" role="tablist">
        <button class="filter-button active" data-filter="all" role="tab" aria-selected="true">Voir tout</button>
        <button class="filter-button" data-filter=".sondages" role="tab" aria-selected="false">Etudes de Sols</button>
        <button class="filter-button" data-filter=".elan" role="tab" aria-selected="false">Loi Elan</button>
        <button class="filter-button" data-filter=".assainissement" role="tab" aria-selected="false">Assainissement</button>
        <button class="filter-button" data-filter=".expertises" role="tab" aria-selected="false">Expertises</button>
        <button class="filter-button" data-filter=".references" role="tab" aria-selected="false">Références</button>
      </div>
      <div class="gallery-grid">
        ${images.map(img => `
          <div class="gallery-item mix ${img.category}">
            <img src="${img.src}" data-full="${img.fullSrc}" alt="${img.alt}" title="${img.title}" data-caption="${img.caption}">
            <div class="hover-caption">${img.caption}</div>
          </div>
        `).join('')}
      </div>
    `;
    galleryContainer.classList.add('loaded');

    const style = localDocument.createElement('style');
    style.textContent = `
      .custom-gallery {
        max-width: 1224px;
        margin: 0 auto;
        padding: 20px;
        display: block !important;
      }
      .filter-buttons {
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        gap: 16px !important;
        margin: 20px 0 !important;
        padding: 10px 0 !important;
        font-weight: bold !important;
      }
      .filter-button {
        padding: 8px 20px !important;
        background: #b09862 !important;
        color: #fff !important;
        cursor: pointer !important;
        border: 2px solid #b09862 !important;
        border-radius: 4px !important;
        font-size: 16px !important;
        transition: background 0.3s, color 0.3s, transform 0.1s !important;
        white-space: nowrap !important;
      }
      .filter-button:hover {
        background: #df5212 !important;
        border: 2px solid #df5212 !important;
      }
      .filter-button.active, .filter-button[aria-selected="true"] {
        background: #df5212 !important;
        border: 2px solid #df5212 !important;
        font-weight: bold !important;
      }
      .filter-button:active {
        transform: scale(0.95) !important;
      }
      .gallery-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px !important;
        padding: 20px !important;
        justify-content: center !important;
        position: relative !important;
        overflow: hidden !important;
        min-height: 424px !important;
      }
      .gallery-item {
        position: relative;
        width: 100% !important;
        height: 200px !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        will-change: transform, opacity !important;
      }
      .gallery-item img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
        border-radius: 8px !important;
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      .gallery-item:hover img {
        transform: scale(1.05);
      }
      .hover-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5) !important;
        color: #fff !important;
        font-size: 14px !important;
        text-align: center;
        padding: 10px !important;
        opacity: 0;
        transition: opacity 0.3s ease !important;
        font-family: arial;
      }
      .gallery-item:hover .hover-caption {
        opacity: 1;
      }
      .lightbox-overlay {
        display: none;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0, 0, 0, 0.85) !important;
        justify-content: center;
        align-items: center;
        z-index: 999999 !important;
        flex-direction: column;
      }
      .lightbox-overlay.active {
        display: flex !important;
      }
      .lightbox-image-container {
        position: relative;
        max-width: 90vw !important;
        max-height: 70vh !important;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .lightbox-img {
        max-width: 100% !important;
        max-height: 70vh !important;
        object-fit: contain !important;
        border-radius: 8px !important;
        box-shadow: 0 0 30px #111 !important;
        display: block !important;
        opacity: 0;
        transition: opacity 0.2s ease !important;
      }
      .lightbox-img.active {
        opacity: 1;
      }
      .thumbnail-container {
        display: flex !important;
        justify-content: center !important;
        gap: 10px !important;
        margin-top: 10px !important;
        overflow-x: auto !important;
        max-width: 90vw !important;
        padding: 10px 0 !important;
      }
      .thumbnail {
        width: 100px !important;
        height: 75px !important;
        object-fit: cover !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        opacity: 0.6 !important;
        transition: opacity 0.3s !important;
        border: 1px solid #fff !important;
      }
      .thumbnail.active {
        opacity: 1 !important;
      }
      .thumbnail:hover {
        opacity: 1 !important;
      }
      .lightbox-arrow, .lightbox-close {
        position: absolute;
        background: rgba(255, 255, 255, 0.7) !important;
        border: none !important;
        cursor: pointer !important;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        z-index: 1000000 !important;
        transition: background 0.2s, transform 0.2s !important;
      }
      .lightbox-arrow:hover {
        background: #fff !important;
        transform: translateY(-50%) scale(1.1) !important;
      }
      .lightbox-close:hover {
        background: #fff !important;
        transform: scale(1.1) !important;
      }
      .lightbox-arrow.prev {
        left: 2vw !important;
        top: 50%;
        transform: translateY(-50%);
      }
      .lightbox-arrow.next {
        right: 2vw !important;
        top: 50%;
        transform: translateY(-50%);
      }
      .lightbox-close {
        top: 20px;
        right: 20px;
      }
      .lightbox-arrow::before, .lightbox-close::before, .lightbox-close::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
      }
      .lightbox-arrow.prev::before {
        width: 12px;
        height: 12px;
        border: solid #222;
        border-width: 0 3px 3px 0;
        transform: translate(-30%, -50%) rotate(135deg);
      }
      .lightbox-arrow.next::before {
        width: 12px;
        height: 12px;
        border: solid #222;
        border-width: 0 3px 3px 0;
        transform: translate(-65%, -50%) rotate(-45deg);
      }
      .lightbox-close::before {
        width: 20px;
        height: 2px;
        background: #222;
        transform: translate(-50%, -50%) rotate(45deg);
      }
      .lightbox-close::after {
        content: '';
        width: 20px;
        height: 2px;
        background: #222;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      /* Option 2 : Légende en bas de l’image dans une bande semi-transparente */
      .lightbox-caption {
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background: rgba(0, 0, 0, 0.7) !important;
        color: #fff !important;
        font-size: 16px !important;
        text-align: center !important;
        padding: 10px !important;
        max-width: 100% !important;
        border-bottom-left-radius: 8px !important;
        border-bottom-right-radius: 8px !important;
        opacity: 0;
        transition: opacity 0.2s ease !important;
      }
      .lightbox-overlay.active .lightbox-caption {
        opacity: 1;
      }
      /* Option 1 : Légende entre l’image et les thumbnails (commentée) */
      /*
      .lightbox-caption {
        color: #fff !important;
        font-size: 16px !important;
        text-align: center !important;
        margin: 10px 0 !important;
        max-width: 90vw !important;
        opacity: 0;
        transition: opacity 0.2s ease !important;
      }
      .lightbox-overlay.active .lightbox-caption {
        opacity: 1;
      }
      */
      @media only screen and (max-width: 400px) {
        .gallery-grid {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
          padding: 8px !important;
          min-height: 376px !important;
        }
        .gallery-item {
          height: 180px !important;
        }
        .lightbox-caption {
          font-size: 14px !important;
          padding: 8px !important;
        }
        .hover-caption {
          font-size: 12px !important;
          padding: 8px !important;
        }
      }
      @media only screen and (min-width: 400px) and (max-width: 920px) {
        .custom-gallery {
          padding: 8px !important;
        }
        .gallery-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 16px !important;
          padding: 8px !important;
          min-height: 396px !important;
        }
        .gallery-item {
          margin-left: 8px !important;
          margin-right: 8px !important;
          height: 190px !important;
        }
        .filter-buttons {
          gap: 8px !important;
          padding: 4px 0 !important;
        }
        .filter-button {
          padding: 8px 10px !important;
          font-size: 15px !important;
        }
      }
    `;
    localDocument.head.appendChild(style);

    const parentStyle = targetDocument.createElement('style');
    parentStyle.setAttribute('data-gallery', 'true');
    parentStyle.textContent = style.textContent;
    const existingStyles = targetDocument.querySelectorAll('style[data-gallery]');
    existingStyles.forEach(style => style.remove());
    targetDocument.head.appendChild(parentStyle);

    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
          const fullSrc = img.getAttribute('data-full');
          const preloadImg = new Image();
          preloadImg.src = fullSrc;
        }
      });
    }

    const script = localDocument.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mixitup@3.3.1/dist/mixitup.min.js';
    script.onload = function() {
      const mixer = mixitup('.gallery-grid', {
        selectors: { target: '.gallery-item' },
        animation: {
          duration: 300,
          effects: 'fade scale(0.95)',
          easing: 'ease-out',
          queue: false
        },
        callbacks: {
          onMixStart: function() {
            const grid = galleryContainer.querySelector('.gallery-grid');
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.position = 'relative';
            wrapper.className = 'gallery-wrapper';
            grid.parentNode.insertBefore(wrapper, grid);
            wrapper.appendChild(grid);
          },
          onMixEnd: function() {
            const grid = galleryContainer.querySelector('.gallery-grid');
            const wrapper = grid.parentNode;
            if (wrapper.classList.contains('gallery-wrapper')) {
              wrapper.parentNode.insertBefore(grid, wrapper);
              wrapper.remove();
            }
          }
        }
      });

      const filterButtons = galleryContainer.querySelectorAll('.filter-button');
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');
        });
      });

      let lightbox = targetDocument.querySelector('.lightbox-overlay');
      if (!lightbox) {
        lightbox = targetDocument.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.id = 'global-lightbox';
        lightbox.innerHTML = `
          <button class="lightbox-close" title="Fermer" aria-label="Fermer la visionneuse"></button>
          <button class="lightbox-arrow prev" title="Précédente" aria-label="Image précédente"></button>
          <div class="lightbox-image-container">
            <img class="lightbox-img" src="" alt="">
            <div class="lightbox-caption"></div>
          </div>
          <button class="lightbox-arrow next" title="Suivante" aria-label="Image suivante"></button>
          <div class="thumbnail-container"></div>
        `;
        targetBody.appendChild(lightbox);
      }

      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const lightboxCaption = lightbox.querySelector('.lightbox-caption');
      const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
      const nextBtn = lightbox.querySelector('.lightbox-arrow.next');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const thumbnailContainer = lightbox.querySelector('.thumbnail-container');
      let currentIndex = 0;
      let isAnimating = false;

      if (!lightboxImg || !lightboxCaption || !prevBtn || !nextBtn || !closeBtn || !thumbnailContainer) {
        return;
      }

      function getVisibleImages() {
        return Array.from(galleryItems).filter(item => {
          const style = window.getComputedStyle(item);
          return style.display !== 'none' && !item.classList.contains('mixitup-hidden');
        });
      }

      function updateThumbnails() {
        const visibleImages = getVisibleImages();
        thumbnailContainer.innerHTML = visibleImages.map((item, idx) => `
          <img class="thumbnail ${idx === currentIndex ? 'active' : ''}"
               src="${item.querySelector('img').src}"
               alt="${item.querySelector('img').alt}"
               title="${item.querySelector('img').title}"
               data-index="${idx}">
        `).join('');
        thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
          thumb.addEventListener('click', () => {
            if (!isAnimating) {
              showLightbox(parseInt(thumb.getAttribute('data-index')));
            }
          });
        });
      }

      function showLightbox(index) {
        if (isAnimating || index < 0 || index >= getVisibleImages().length) {
          isAnimating = false;
          return;
        }
        isAnimating = true;
        const visibleImages = getVisibleImages();
        currentIndex = index;
        const newSrc = visibleImages[currentIndex].querySelector('img').getAttribute('data-full');
        const newAlt = visibleImages[currentIndex].querySelector('img').alt;
        const newTitle = visibleImages[currentIndex].querySelector('img').title;
        const newCaption = visibleImages[currentIndex].querySelector('img').getAttribute('data-caption');

        lightboxImg.classList.remove('active');
        lightboxCaption.style.opacity = '0';
        setTimeout(() => {
          lightboxImg.src = newSrc;
          lightboxImg.alt = newAlt;
          lightboxImg.title = newTitle;
          lightboxCaption.textContent = newCaption;
          lightboxImg.classList.add('active');
          lightboxCaption.style.opacity = '1';
          isAnimating = false;
        }, 200);

        lightbox.classList.add('active');
        updateThumbnails();
        targetBody.style.overflow = 'hidden';
      }

      galleryItems.forEach((item, idx) => {
        const img = item.querySelector('img');
        if (img) {
          img.addEventListener('click', (e) => {
            e.stopPropagation();
            const visibleImages = getVisibleImages();
            const visibleIndex = visibleImages.indexOf(item);
            if (visibleIndex !== -1 && !isAnimating) {
              showLightbox(visibleIndex);
            }
          });
        }
      });

      function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
        lightboxImg.alt = '';
        lightboxImg.title = '';
        lightboxCaption.textContent = '';
        lightboxImg.classList.remove('active');
        thumbnailContainer.innerHTML = '';
        targetBody.style.overflow = '';
        isAnimating = false;
      }

      function showPrev() {
        if (isAnimating) return;
        const visibleImages = getVisibleImages();
        let idx = currentIndex - 1;
        if (idx < 0) idx = visibleImages.length - 1;
        if (visibleImages[idx]) {
          showLightbox(idx);
        }
      }

      function showNext() {
        if (isAnimating) return;
        const visibleImages = getVisibleImages();
        let idx = currentIndex + 1;
        if (idx >= visibleImages.length) idx = 0;
        if (visibleImages[idx]) {
          showLightbox(idx);
        }
      }

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
      });

      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });

      targetDocument.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active') || isAnimating) return;
        if (e.key === 'Escape') {
          closeLightbox();
        }
        if (e.key === 'ArrowLeft') {
          showPrev();
        }
        if (e.key === 'ArrowRight') {
          showNext();
        }
      });
    };
    localDocument.head.appendChild(script);

    if (isInIframe) {
      const updateHeight = () => {
        const height = galleryContainer.offsetHeight;
        window.parent.postMessage({ action: 'iframeHeightUpdated', height, id: 'zhl_XD' }, '*');
      };
      new ResizeObserver(updateHeight).observe(galleryContainer);
      updateHeight();
    }
  });
})();
