import Link from "next/link";

export default function PageAbout() {
  return (
    <main className="container flex min-h-screen flex-col gap-4 px-4 py-16">
      <h1 className="text-3xl font-bold">O Comp CTF-u</h1>
      <div className="prose">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
          interdum, lacus vitae malesuada mattis, enim arcu rhoncus odio, at
          blandit diam ante eu urna. Mauris sit amet velit in nunc pulvinar
          aliquet. Suspendisse potenti. In tempor lorem in accumsan vehicula.
          Sed quis purus ut nunc lobortis elementum et varius erat. Vestibulum
          tempor sem nec molestie maximus. Quisque lobortis libero ut mauris
          imperdiet mollis. Sed ut nisi facilisis tortor convallis vestibulum
          quis pulvinar eros. Cras rhoncus nec leo nec vestibulum. Suspendisse
          vitae dolor id tortor dictum blandit. Quisque neque lectus, commodo a
          libero in, ullamcorper sagittis mi. Integer nec tellus molestie,
          dapibus elit sed, malesuada odio. Duis iaculis nisi eget enim
          tristique, quis ullamcorper libero blandit.
        </p>
        <p>
          Curabitur vulputate vitae orci non eleifend. Proin quis tellus lectus.
          Donec ex urna, efficitur eget dolor eget, malesuada viverra erat.
          Donec non lorem a lorem cursus commodo. Suspendisse laoreet ornare
          risus in accumsan. Maecenas tincidunt lacinia ante id sagittis. In hac
          habitasse platea dictumst. Ut interdum imperdiet volutpat. Morbi quis
          metus velit.
        </p>
        <p>
          Sed auctor, dolor nec feugiat cursus, sapien nulla vulputate lorem, in
          maximus leo tellus eu quam. In nec auctor mauris. Etiam a tortor
          massa. In faucibus ante metus, ut mattis ex accumsan non. Praesent
          purus neque, tempor quis risus vitae, eleifend pellentesque nunc.
          Etiam non lorem viverra, tincidunt ipsum vel, pretium odio. Nullam
          luctus, nunc quis dignissim aliquam, tellus neque blandit augue, id
          egestas risus mauris nec enim. Nullam maximus turpis ut orci hendrerit
          aliquet. Sed eu turpis non ipsum volutpat interdum. Cras metus sem,
          vehicula sit amet lacinia nec, convallis et turpis. Vivamus varius
          luctus accumsan. Praesent gravida diam enim, vel ultrices enim
          suscipit sit amet. Aenean pretium, nulla ut gravida bibendum, libero
          risus pretium mauris, id cursus sem lacus eget nisl. Donec semper nibh
          nec iaculis fermentum.
        </p>

        <p>
          Vestibulum in blandit massa. In condimentum ante et ligula efficitur
          feugiat. Ut lacus est, pretium quis nunc a, consequat lacinia enim. Ut
          aliquam turpis libero, vel posuere justo luctus laoreet. Praesent
          libero sapien, tempor ut iaculis in, elementum quis ipsum. Phasellus
          feugiat vestibulum ante, sit amet dictum metus dapibus vel.
          Suspendisse pretium nisl justo, a tempus arcu ultrices sed. Duis
          egestas nibh vel vehicula efficitur. Suspendisse ipsum risus, vehicula
          ut faucibus ut, tempor sit amet sapien. Etiam aliquam erat a nisi
          maximus, a dignissim ex aliquam. Aenean blandit justo in risus
          interdum, sed sollicitudin massa feugiat. Mauris viverra nulla orci,
          id pulvinar elit pretium a. Mauris bibendum posuere lobortis. Proin
          sapien arcu, tempus id condimentum vel, malesuada id lectus.
        </p>

        <p>
          Suspendisse euismod finibus dignissim. Nam ac velit diam. Vestibulum
          ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia
          curae; Curabitur vitae justo purus. Ut quis laoreet sapien. Donec a
          dapibus enim, eget eleifend mauris. Pellentesque est mauris, mollis
          vitae iaculis vel, interdum ac odio. Mauris lacinia rhoncus molestie.
          Praesent odio lectus, convallis non dui ut, condimentum dapibus dolor.
          Nam id tristique velit, sed aliquet tellus. Cras elementum at neque
          non fringilla. Nulla vel lectus at felis blandit eleifend. Proin sed
          ipsum vel massa sollicitudin lobortis.
        </p>
      </div>

      <div className="mt-4">
        <Link
          className="rounded-md bg-primary p-4 text-2xl font-bold text-white dark:text-black"
          href="/home"
        >
          Započni
        </Link>
      </div>
    </main>
  );
}
